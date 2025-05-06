<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
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
            'email' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
            'group' => 'nullable|string|max:255',
        ]);

        // Set default values
        $perPage = $validated['per_page'] ?? self::DEFAULT_PER_PAGE;
        $email = $validated['email'] ?? null;
        $username = $validated['username'] ?? null;
        $phone = $validated['phone'] ?? null;
        $active = isset($validated['is_active']) ? $validated['is_active'] : null;
        $group = $validated['group'] ?? null;

        try {
            $query = User::query();

            // Eager-load group only if group filter is applied
            if ($group) {
                $query->with(['group']);
            }

            // Apply filters
            if ($email) {
                $query->where('email', 'like', '%' . $email . '%');
            }

            if ($username) {
                $query->where('username', 'like', '%' . $username . '%');
            }

            if ($phone) {
                $query->where('phone', 'like', '%' . $phone . '%');
            }

            if (isset($active)) {
                $query->where('is_active', $active);
            }

            if ($group) {
                $query->whereHas('group', function ($q) use ($group) {
                    $q->where('name', $group);
                });
            }

            // Execute query with pagination
            $customers = $query->orderBy('id', 'desc')->paginate($perPage);

            // Return JSON response
            return response()->json([
                'success' => true,
                'data' => CustomerResource::collection($customers),
                'meta' => [
                    'current_page' => $customers->currentPage(),
                    'per_page' => $customers->perPage(),
                    'total' => $customers->total(),
                    'last_page' => $customers->lastPage(),
                    'from' => $customers->firstItem(),
                    'to' => $customers->lastItem(),
                ],
                'links' => [
                    'first' => $customers->url(1),
                    'last' => $customers->url($customers->lastPage()),
                    'prev' => $customers->previousPageUrl(),
                    'next' => $customers->nextPageUrl(),
                ],
            ]);
        } catch (\Throwable $th) {
            // Handle exceptions
            Log::error('Product listing error: ' . $th->getMessage());
            return $this->errorResponse('An error occurred while fetching customers.', 500, $th->getMessage());
        }
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all, [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'group_id' => 'nullable|exists:groups,id',
        ]);
        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        try {
            DB::transaction(function () use ($request) {
                // Create customer
                $user = $this->createCustomer($request);
                return $this->successResponse(
                    'Customer created successfully',
                    new CustomerResource($user->load(['group'])),
                    201
                );
            });
        } catch (\Throwable $th) {
            Log::error('Customer creation error: ' . $th->getMessage());
            return $this->errorResponse('An error occurred while creating the customer.', 500, $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $customer = User::with(['group'])->findOrFail($id);
            return $this->successResponse('Customer retrieved successfully', new UserResource($customer));
        } catch (\Throwable $th) {
            Log::error('Customer retrieval error: ' . $th->getMessage());
            return $this->errorResponse('An error occurred while retrieving the customer.', 500, $th->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'group_id' => 'nullable|exists:groups,id',
        ]);
        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        try {
            return DB::transaction(function () use ($request, $id) {
                // Update customer
                $user = User::findOrFail($id);
                $this->updateCustomer($user, $request);
                return $this->successResponse(
                    'Customer updated successfully',
                    new CustomerResource($user->load(['group'])),
                    200
                );
            });
        } catch (\Throwable $th) {
            Log::error('Customer update error: ' . $th->getMessage());
            return $this->errorResponse('An error occurred while updating the customer.', 500, $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
           return DB::transaction(function () use ($id) {
                // Delete customer
                $user = User::findOrFail($id);
                $user->delete();
                return $this->successResponse('Customer deleted successfully', null, 200);
            });
        } catch (\Throwable $th) {
            Log::error('Customer deletion error: ' . $th->getMessage());
            return $this->errorResponse('An error occurred while deleting the customer.', 500, $th->getMessage());
        }
    }

    private function createCustomer($request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt(1234),
            'phone' => $request->phone,
            'is_active' =>  1,
            'group_id' => $request->group_id ? $request->group_id : null,
            'created_by' => Auth::user()->id,
        ]);

        return $user;
    }

    private function updateCustomer($user, $request)
    {
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'group_id' => $request->group_id ? $request->group_id : null,
            'updated_by' => Auth::user()->id,
        ]);

        return $user;
    }
}
