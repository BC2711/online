<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Product_cartegory_mapping;
use App\Models\ProductCategoryMapping;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    private const PRODUCT_IMAGE_PATH = 'products';
    private const DEFAULT_PER_PAGE = 10;
    private const MAX_IMAGE_SIZE = 5048; // 5MB
    private const ALLOWED_IMAGE_TYPES = ['jpeg', 'png', 'jpg', 'gif'];

    /**
     * Display a paginated listing of products with search capability.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', self::DEFAULT_PER_PAGE);
            $search = $request->query('search', '');

            $products = Product::with(['categories', 'images'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhereHas('categories', function ($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'last_page' => $products->lastPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ],
                'links' => [
                    'first' => $products->url(1),
                    'last' => $products->url($products->lastPage()),
                    'prev' => $products->previousPageUrl(),
                    'next' => $products->nextPageUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Product listing error: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve products', 500);
        }
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'quantity_in_stock' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:product_categories,id',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:' . self::MAX_IMAGE_SIZE,
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        return DB::transaction(function () use ($request) {
            try {
                $product = $this->createProduct($request);
                $this->handleCategoryMappingUpdate($product->id, $request->category_id);

                if ($request->hasFile('images')) {
                    $this->processProductImages($request->file('images'), $product->id);
                }

                return $this->successResponse(
                    'Product created successfully',
                    new ProductResource($product->load(['categories', 'images'])),
                    201
                );
            } catch (\Exception $e) {
                Log::error('Product creation error: ' . $e->getMessage());
                return $this->errorResponse('Failed to create product', 500);
            }
        });
    }

    /**
     * Display the specified product.
     */
    public function show(string $id)
    {
        try {
            $product = Product::with(['categories', 'images'])->findOrFail($id);
            return $this->successResponse(
                'Product retrieved successfully',
                new ProductResource($product)
            );
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Product not found', 404);
        } catch (\Exception $e) {
            Log::error('Product retrieval error: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve product', 500);
        }
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:products,name,' . $id,
                'description' => 'nullable|string|max:1000',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0|lt:price',
                'quantity_in_stock' => 'required|integer|min:0',
                'weight' => 'nullable|numeric|min:0',
                'category_id' => 'required|exists:product_categories,id',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:' . self::MAX_IMAGE_SIZE,
                'delete_images' => 'nullable|array',
                'delete_images.*' => 'exists:product_images,id,product_id,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Validation failed', 422, $validator->errors());
            }

            return DB::transaction(function () use ($request, $product) {
                try {
                    $this->updateProduct($product, $request);
                    $this->handleCategoryMappingUpdate($product->id, $request->category_id);

                    if ($request->has('delete_images')) {
                        $this->deleteProductImages($request->delete_images);
                    }

                    if ($request->hasFile('images')) {
                        $this->processProductImages($request->file('images'), $product->id);
                    }

                    return $this->successResponse(
                        'Product updated successfully',
                        new ProductResource($product->fresh(['categories', 'images']))
                    );
                } catch (\Exception $e) {
                    Log::error('Product update error: ' . $e->getMessage() . " on line " . $e->getLine() . " in method " . request()->method());
                    Log::error('Product update error: ' . $e->getMessage()." ".$e->getLine());
                    return $this->errorResponse('Failed to update product: '.$e->getMessage()."method ".request()->method(), 500);
                }
            });
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Product not found', 404);
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);

            DB::transaction(function () use ($product) {
                // Delete associated images first
                $this->deleteProductImages($product->images->pluck('id')->toArray());
                $product->delete();
            });

            return $this->successResponse('Product deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Product not found', 404);
        } catch (\Exception $e) {
            Log::error('Product deletion error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete product', 500);
        }
    }

    /**
     * Helper method to create a new product
     */
    private function createProduct(Request $request): Product
    {
        return Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'sku' => $this->generateSku($request->name),
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'quantity_in_stock' => $request->quantity_in_stock,
            'weight' => $request->weight ?? 300,
            'is_active' => true,
            'created_by' => Auth::id(),
        ]);
    }

    /**
     * Helper method to update an existing product
     */
    private function updateProduct(Product $product, Request $request): void
    {
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'quantity_in_stock' => $request->quantity_in_stock,
            'weight' => $request->weight ?? $product->weight,
            'is_active' => $request->is_active ?? $product->is_active,
            'updated_by' => Auth::id(),
        ]);
    }

    /**
     * Generate a unique SKU for the product
     */
    private function generateSku(string $productName): string
    {
        $prefix = 'SKU-' . Str::slug(Str::words($productName, 3, ''));
        $uniqueId = Str::upper(Str::random(6));

        return "{$prefix}-{$uniqueId}";
    }

    /**
     * Handle product category mapping
     */
    private function handleCategoryMapping(int $productId, int $categoryId): void
    {
        Product_cartegory_mapping::Create(
            [
                'product_id' => $productId,
                'category_id' => $categoryId,
                'created_by' => Auth::id()
            ]
        );
    }
    private function handleCategoryMappingUpdate(int $productId, int $newCategoryId): void
    {
        // Find the existing mapping for the product
        Product_cartegory_mapping::where('product_id', $productId)->delete();       

        // Create a new record with the updated category_id
        Product_cartegory_mapping::create([
            'product_id' => $productId,
            'category_id' => $newCategoryId,
            'created_by' => Auth::id(),
        ]);
    }


    /**
     * Process and store product images
     */
    private function processProductImages(array $images, int $productId): void
    {
        // Log a message indicating successful processing of product images
        // Log::info('Product '.$productId.' images processed successfully.');
        foreach ($images as $image) {
            try {
                $fileName = $this->generateFileName($image);
                $path = $image->storeAs(self::PRODUCT_IMAGE_PATH, $fileName, 'public');

                // Create thumbnail
                // $this->createThumbnail($path);

                ProductImage::create([
                    'product_id' => $productId,
                    'image_url' => $path,
                    // 'alt_text' => $this->getThumbnailPath($path),
                    'created_by' => Auth::id(),
                ]);
            } catch (\Exception $e) {
                Log::error('Image processing error: ' . $e->getMessage());
                continue; // Skip this image but continue with others
            }
        }
    }

    /**
     * Generate a unique file name for uploaded images
     */
    private function generateFileName($image): string
    {
        return time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
    }

    /**
     * Create a thumbnail version of the image
     */
    // private function createThumbnail(string $path): void
    // {
    //     $thumbnailPath = $this->getThumbnailPath($path);

    //     // Instantiate ImageManager with the GD driver
    //     $manager = new ImageManager('gd');

    //     // Use the 'read' method to load the image
    //     $image = $manager->read(storage_path('app/public/' . $path))
    //         ->fit(300, 300, function ($constraint) {
    //             $constraint->aspectRatio();
    //         })
    //         ->save(storage_path('app/public/' . $thumbnailPath));
    // }

    /**
     * Get thumbnail path from original path
     */
    // private function getThumbnailPath(string $originalPath): string
    // {
    //     $pathInfo = pathinfo($originalPath);
    //     return $pathInfo['dirname'] . '/thumbs/' . $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];
    // }

    /**
     * Delete product images from storage and database
     */
    private function deleteProductImages(array $imageIds): void
    {
        // log::error('image ids:'.$imageIds);
        $images = ProductImage::whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            try {
                // Delete original image
                Storage::disk('public')->delete($image->image_url);

                // Delete thumbnail if exists
                if ($image->thumbnail_url) {
                    Storage::disk('public')->delete($image->thumbnail_url);
                }

                $image->delete();
            } catch (\Exception $e) {
                Log::error('Image deletion error: ' . $e->getMessage());
            }
        }
    }
}
