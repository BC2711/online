<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupResource;
use App\Models\Groups;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    private const DEFAULT_PER_PAGE = 4;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100',
            'name' => 'nullable|string|max:255',
        ]);

        // Set default values
        $perPage = $validated['per_page'] ?? self::DEFAULT_PER_PAGE;
        $name = $validated['name'] ?? null;

        try {
            $query = Groups::query();

            // Apply filters
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }

            // Paginate results
            $groups = $query->paginate($perPage);
            return response()->json([
                'success' => true,
                'data' => GroupResource::collection($groups),
                'meta' => [
                    'current_page' => $groups->currentPage(),
                    'per_page' => $groups->perPage(),
                    'total' => $groups->total(),
                    'last_page' => $groups->lastPage(),
                    'from' => $groups->firstItem(),
                    'to' => $groups->lastItem(),
                ],
                'links' => [
                    'first' => $groups->url(1),
                    'last' => $groups->url($groups->lastPage()),
                    'prev' => $groups->previousPageUrl(),
                    'next' => $groups->nextPageUrl(),
                ],
            ]);
            return response()->json($groups);
        } catch (\Exception $e) {
            Log::error('Product listing error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while fetching groups.', 500, $e->getMessage());
        }
    }

    public function getAllGroups()
    {
        try {
            $groups = Groups::all();
            return $this->successResponse('Groups retrieved successfully', GroupResource::collection($groups));
        } catch (\Exception $e) {
            Log::error('Group retrieval error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while retrieving groups.', 500, $e->getMessage());
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Ensure the user is authenticated
        if (!Auth::check()) {
            return $this->errorResponse('Unauthorized.', 401);
        }

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ], [
            'name.required' => 'The group name is required.',
            'name.string' => 'The group name must be a string.',
            'name.max' => 'The group name may not be greater than 255 characters.',
            'status.required' => 'The status field is required.',
            'status.string' => 'The status must be a string.',
            'status.in' => 'The status must be either "active" or "inactive".',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error.', 422, $validator->errors());
        }

        try {
            $group = DB::transaction(function () use ($request) {
                // Create a new group
                return Groups::create([
                    'name' => $request->name,
                    'status' => Str::upper($request->status), 
                    'created_by' => Auth::id(),
                ]);
            });

            return $this->successResponse(
                'Group created successfully.',
                new GroupResource($group),
                201
            );
        } catch (\Exception $e) {
            Log::error('Group creation failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse('An error occurred while creating the group.', 500, $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $group = Groups::findOrFail($id);
            return $this->successResponse('Group retrieved successfully', new GroupResource($group));
        } catch (\Exception $e) {
            Log::error('Group retrieval error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while retrieving the group.', 500, $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        try {
            return DB::transaction(function () use ($request, $id) {
                // Update the group
                $group = Groups::findOrFail($id);
                $group->update([
                    'name' => $request->name,
                    'updated_by' => Auth::id(),
                ]);
                return $this->successResponse(
                    'Group updated successfully',
                    new GroupResource($group),
                    200
                );
            });
        } catch (\Exception $e) {
            Log::error('Group update error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while updating the group.', 500, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            return DB::transaction(function () use ($id) {
                // Delete the group
                $group = Groups::findOrFail($id);
                $group->delete();
                return $this->successResponse('Group deleted successfully', null, 204);
            });
        } catch (\Exception $e) {
            Log::error('Group deletion error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while deleting the group.', 500, $e->getMessage());
        }
    }
}
