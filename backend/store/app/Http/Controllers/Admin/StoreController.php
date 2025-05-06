<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        try {
            $perPage = $request->input('per_page', 10);
            $stores = Store::query()
                ->where('created_by', Auth::id())
                ->paginate($perPage);

            return $this->successResponse(
                'Stores retrieved successfully.',
                [
                    'data' => StoreResource::collection($stores->items()),
                    'meta' => [
                        'current_page' => $stores->currentPage(),
                        'per_page' => $stores->perPage(),
                        'total' => $stores->total(),
                        'last_page' => $stores->lastPage(),
                    ],
                    'links' => [
                        'prev' => $stores->previousPageUrl(),
                        'next' => $stores->nextPageUrl(),
                        'first' => $stores->url(1),
                        'last' => $stores->url($stores->lastPage()),
                    ],
                ]
            );
        } catch (\Exception $e) {
            Log::error('Store retrieval failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse('An error occurred while retrieving stores.', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive',
            'currency' => ['required', 'string', 'max:3', Rule::in(['ZMW', 'USD', 'EUR'])], // Example ISO 4217 codes
            'timezone' => ['required', 'string', 'max:50', Rule::in(\DateTimeZone::listIdentifiers())],
            'city' => 'nullable|string|max:100',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|string|max:20',
        ], [
            'name.required' => 'The store name is required.',
            'address.required' => 'The store address is required.',
            'status.required' => 'The store status is required.',
            'currency.required' => 'The store currency is required.',
            'timezone.required' => 'The store timezone is required.',
            'email.email' => 'The store email must be a valid email address.',
            'website.url' => 'The store website must be a valid URL.',
            'logo.url' => 'The store logo must be a valid URL.',
            'facebook.url' => 'The Facebook URL must be a valid URL.',
            'twitter.url' => 'The Twitter URL must be a valid URL.',
            'instagram.url' => 'The Instagram URL must be a valid URL.',
            'tiktok.url' => 'The TikTok URL must be a valid URL.',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error.', 422, $validator->errors());
        }

        try {
            $store = DB::transaction(function () use ($request) {
                return Store::create([
                    'name' => $request->name,
                    'address' => $request->address,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'website' => $request->website,
                    'logo' => $request->logo,
                    'status' => $request->status,
                    'currency' => $request->currency,
                    'timezone' => $request->timezone,
                    'city' => $request->city,
                    'facebook' => $request->facebook,
                    'twitter' => $request->twitter,
                    'instagram' => $request->instagram,
                    'tiktok' => $request->tiktok,
                    'whatsapp' => $request->whatsapp,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);
            });

            return $this->successResponse(
                'Store created successfully.',
                new StoreResource($store),
                201
            );
        } catch (\Exception $e) {
            Log::error('Store creation failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse('An error occurred while creating the store.', 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        try {
            $store = Store::where('created_by', Auth::id())->findOrFail($id);
            return $this->successResponse(
                'Store retrieved successfully.',
                new StoreResource($store)
            );
        } catch (\Exception $e) {
            Log::error('Store retrieval failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'store_id' => $id,
            ]);
            return $this->errorResponse('Store not found or an error occurred.', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|url|max:255',
            'status' => 'sometimes|required|in:active,inactive',
            'currency' => ['sometimes', 'required', 'string', 'max:3', Rule::in(['ZMW', 'USD', 'EUR'])],
            'timezone' => ['sometimes', 'required', 'string', 'max:50', Rule::in(\DateTimeZone::listIdentifiers())],
            'city' => 'nullable|string|max:100',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|string|max:20',
        ], [
            'name.required' => 'The store name is required.',
            'address.required' => 'The store address is required.',
            'status.required' => 'The store status is required.',
            'currency.required' => 'The store currency is required.',
            'timezone.required' => 'The store timezone is required.',
            'email.email' => 'The store email must be a valid email address.',
            'website.url' => 'The store website must be a valid URL.',
            'logo.url' => 'The store logo must be a valid URL.',
            'facebook.url' => 'The Facebook URL must be a valid URL.',
            'twitter.url' => 'The Twitter URL must be a valid URL.',
            'instagram.url' => 'The Instagram URL must be a valid URL.',
            'tiktok.url' => 'The TikTok URL must be a valid URL.',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error.', 422, $validator->errors());
        }

        try {
            $store = DB::transaction(function () use ($request, $id) {
                $store = Store::where('created_by', Auth::id())->findOrFail($id);
                $store->update(array_merge($request->only([
                    'name',
                    'address',
                    'phone',
                    'email',
                    'website',
                    'logo',
                    'status',
                    'currency',
                    'timezone',
                    'city',
                    'facebook',
                    'twitter',
                    'instagram',
                    'tiktok',
                    'whatsapp',
                ]), ['updated_by' => Auth::id()]));
                return $store;
            });

            return $this->successResponse(
                'Store updated successfully.',
                new StoreResource($store)
            );
        } catch (\Exception $e) {
            Log::error('Store update failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'store_id' => $id,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse('Store not found or an error occurred.', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        try {
            $store = DB::transaction(function () use ($id) {
                $store = Store::where('created_by', Auth::id())->findOrFail($id);
                $store->update(['deleted_by' => Auth::id()]);
                $store->delete(); // Soft delete
                return $store;
            });

            return $this->successResponse('Store deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Store deletion failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'store_id' => $id,
            ]);
            return $this->errorResponse('Store not found or an error occurred.', 404);
        }
    }

    /**
     * Return a success JSON response.
     *
     * @param string $message
     * @param mixed $data
     * @param int $statusCode
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse(string $message, $data = null, int $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data['data'] ?? $data,
            'meta' => $data['meta'] ?? null,
            'links' => $data['links'] ?? null,
        ], $statusCode);
    }

    /**
     * Return an error JSON response.
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse(string $message, int $statusCode, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}
