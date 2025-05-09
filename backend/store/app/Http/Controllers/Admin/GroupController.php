<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupResource;
use App\Models\Groups;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class GroupController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'integer|min:1|max:100',
            'name' => 'nullable|string|max:255',
            'status' => 'nullable|string',
        ]);

        // Set default values
        $perPage = $validated['per_page'] ?? self::DEFAULT_PER_PAGE;
        $name = $validated['name'] ?? null;
        $status = $validated['status'] ?? null;

        try {
            $query = Groups::query();

            // Apply filters
            if ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            }
            if ($status) {
                $stat = $status;
                if ($status == 'ALL') {
                    $stat = '';
                }
                $query->where('status', Str::upper($stat));
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
            return $this->successResponse(
                'Groups retrieved successfully',
                GroupResource::collection($groups),
                200
            );
        } catch (\Exception $e) {
            Log::error('Group retrieval error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id() ?? null,
            ]);

            return $this->errorResponse(
                'Failed to retrieve groups.',
                500,
                app()->environment('production') ? null : $e->getMessage()
            );
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
            'name' => 'required|string|max:255|unique:groups,name',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
        ], [
            'name.required' => 'The group name is required.',
            'name.string' => 'The group name must be a string.',
            'name.max' => 'The group name may not be greater than 255 characters.',
            'name.unique' => 'The group name has already been taken.',
            'status.required' => 'The status field is required.',
            'status.string' => 'The status must be a string.',
            'status.in' => 'The status must be either "active" or "inactive".',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error.', 422, $validator->errors());
        }

        try {
            $group = DB::transaction(function () use ($request) {
                return Groups::create([
                    'name' => $request->name,
                    'status' => $request->status,
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
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            return $this->errorResponse('Invalid ID provided.', 400, null);
        }

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:groups,name,' . $id],
            'status' => ['required', 'string', 'in:ACTIVE,INACTIVE'],
        ], [
            'name.required' => 'Group name is required.',
            'name.string' => 'The group name must be a string.',
            'name.max' => 'The group name may not be greater than 255 characters.',
            'name.unique' => 'The group name has already been taken.',
            'status.required' => 'The status field is required.',
            'status.string' => 'The status must be a string.',
            'status.in' => 'The status must be either "ACTIVE" or "INACTIVE".',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        try {
            $group = DB::transaction(function () use ($request, $id) {
                $group = Groups::findOrFail($id);
                $group->update([
                    'name' => $request->name,
                    'status' => $request->status,
                    'updated_by' => Auth::id(),
                ]);
                return $group; // Return the model instance, not the boolean
            });

            return $this->successResponse(
                'Group updated successfully',
                new GroupResource($group),
                200
            );
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Group not found.', 404, null);
        } catch (\Exception $e) {
            Log::error('Group update error: ' . $e->getMessage(), [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred while updating the group.', 500, null);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $group = Groups::findOrFail($id);
            $user = User::where('group_id', $id)->exists();
            if ($user) {
                return $this->errorResponse(
                    'Cannot delete Group because it has User. Please reassign or delete the users first.',
                    422
                );
            }

            $group->delete();
            return $this->successResponse('Group deleted successfully.',  new GroupResource($group));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Group not found', 404, $e);
        } catch (\Exception $e) {
            // Log other unexpected errors
            Log::error('Group deletion error: ' . $e->getMessage());
            return $this->errorResponse('An error occurred while deleting the group.', 500, null);
        }
    }
}
