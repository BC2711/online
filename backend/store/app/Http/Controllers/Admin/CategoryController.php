<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCategoryResource;
use App\Models\Product;
use App\Models\Product_cartegory_mapping;
use App\Models\ProductCategory;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $categories = ProductCategory::query()
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ProductCategoryResource::collection($categories->items()),
            'links' => [
                'first' => $categories->url(1),
                'last' => $categories->url($categories->lastPage()),
                'prev' => $categories->previousPageUrl(),
                'next' => $categories->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $categories->currentPage(),
                'from' => $categories->firstItem(),
                'last_page' => $categories->lastPage(),
                'path' => $categories->path(),
                'per_page' => $categories->perPage(),
                'to' => $categories->lastItem(),
                'total' => $categories->total(),
            ],
        ]);
    }

    public function dropdownCategory()
    {
        try {
            $categories = ProductCategory::query()->orderBy('name', 'asc')->get();
            return $this->successResponse(
                'Category retrieved successfully',
                ProductCategoryResource::collection($categories)
            );
        } catch (ModelNotFoundException $th) {
            return $this->errorResponse('Category not found', 404, $th->getMessage());
        } catch (Exception $e) {
            Log::error('Category retrieval error: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve product', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if the user is authorized to create categories
        // $this->authorize('create', ProductCategory::class);

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:product_categories,name',
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'The Category name is required.',
            'name.string' => 'The Category name must be latters only.',
            'name.unique' => 'The category name provided already exists.'
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        return DB::transaction(function () use ($request) {
            try {
                $category = ProductCategory::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'created_by' => Auth::user()->id,
                ]);
                return $this->successResponse(
                    'Category created successfully.',
                    new ProductCategoryResource($category),
                    201
                );
            } catch (\Throwable $th) {
                Log::error('Category creation error: ' . $th->getMessage());
                return $this->errorResponse('Failed to create category', 500);
            }
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $category = ProductCategory::find($id);
            return $this->successResponse(
                'Category retrieved successfully',
                new ProductCategoryResource($category)
            );
        } catch (ModelNotFoundException $th) {
            return $this->errorResponse('Category not found', 404, $th->getMessage());
        } catch (Exception $e) {
            Log::error('Category retrieval error: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve product', 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return $this->errorResponse('Category not found', 404, '');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:product_categories,name,' . $id,
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        return DB::transaction(function () use ($category, $request) {
            try {
                $category->update([
                    'name' => $request->name,
                    'description' => $request->description,
                ]);
                return $this->successResponse(
                    'Category updated successfully.',
                    new ProductCategoryResource($category),
                    201
                );
            } catch (\Throwable $th) {
                Log::error('Category update error: ' . $th->getMessage());
                return $this->errorResponse('Failed to create category', 500);
            }
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Find the category
            $category = ProductCategory::findOrFail($id);

            // Check if the category is a parent to other categories (self-referential)
            $childCategories = ProductCategory::where('parent_category_id', $id)->exists();
            if ($childCategories) {
                return $this->errorResponse(
                    'Cannot delete category because it has subcategories. Please reassign or delete the subcategories first.',
                    422
                );
            }

            // Check if the category is used in the products table (assuming a products table exists)
            $productsUsingCategory = Product_cartegory_mapping::query()->where('category_id', $id)->exists();
            if ($productsUsingCategory) {
                return $this->errorResponse(
                    'Cannot delete category because it is assigned to one or more products. Please reassign or remove the products first.',
                    422
                );
            }

            // If no dependencies, proceed with deletion
            $category->delete();

            return $this->successResponse(
                'Category deleted successfully',
                new ProductCategoryResource($category)
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Category not found', 404, $e);
        } catch (\Throwable $th) {
            return $this->errorResponse('An unexpected error occurred while deleting the category', 500, $th->getMessage());
        }
    }
}
