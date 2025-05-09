<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
            'status' => 'nullable|boolean',
        ]);

        // Set default values
        $perPage = $validated['per_page'] ?? self::DEFAULT_PER_PAGE;
        $email = $validated['email'] ?? null;
        $username = $validated['username'] ?? null;
        $phone = $validated['phone'] ?? null;
        $active = isset($validated['status']) ? $validated['status'] : null;

        try {
            $query = User::query();

            // Eager-load group only if group filter is applied
            // if ($group) {
            //     $query->with(['group']);
            // }

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
                $status = $active ? 1 : 0;
                $query->where('is_active', $status);
            }

            // if ($group) {
            //     $query->whereHas('group', function ($q) use ($group) {
            //         $q->where('name', $group);
            //     });
            // }

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

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:10', 'regex:/^\+?\d{10,15}$/', 'unique:users,phone'],
            'group_id' => ['required', 'integer', Rule::exists('groups', 'id')],
            'is_active' => ['required', 'boolean'],
        ], [
            'first_name.required' => 'First name is required.',
            'first_name.string' => 'First name must be a string.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.string' => 'Last name must be a string.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'username.required' => 'Username is required.',
            'username.string' => 'Username must be a string.',
            'username.max' => 'Username cannot exceed 255 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email cannot exceed 255 characters.',
            'email.unique' => 'This email is already taken.',
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone must be a string.',
            'phone.max' => 'Phone cannot exceed 10 numbers.',
            'phone.regex' => 'Phone must be a valid number (e.g., 0965508033).',
            'phone.unique' => 'This Phone number is already taken.',
            'group_id.required' => 'Group is required.',
            'group_id.integer' => 'Group ID must be an integer.',
            'group_id.exists' => 'Selected group does not exist.',
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
        ]);
        if ($validator->fails()) {
            return $this->errorResponse('Validation error', 422, $validator->errors());
        }

        try {
            $customer = DB::transaction(function () use ($request) {
                return $this->createCustomer($request);
            });
            return $this->successResponse(
                'Customer created successfully',
                new CustomerResource($customer->load(['group'])),
                201
            );
        } catch (\Throwable $th) {
            Log::error('Customer creation error: ' . $request);
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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $id],
            'phone' => ['required', 'string', 'max:10', 'regex:/^\+?\d{10,15}$/', 'unique:users,phone,' . $id],
            'group_id' => ['required', 'integer', Rule::exists('groups', 'id')],
            'is_active' => ['required', 'boolean'],
        ], [
            'first_name.required' => 'First name is required.',
            'first_name.string' => 'First name must be a string.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.string' => 'Last name must be a string.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'username.required' => 'Username is required.',
            'username.string' => 'Username must be a string.',
            'username.max' => 'Username cannot exceed 255 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email cannot exceed 255 characters.',
            'email.unique' => 'This email is already taken.',
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone must be a string.',
            'phone.max' => 'Phone cannot exceed 10 numbers.',
            'phone.regex' => 'Phone must be a valid number (e.g., 0965508033).',
            'phone.unique' => 'This Phone number is already taken.',
            'group_id.required' => 'Group is required.',
            'group_id.integer' => 'Group ID must be an integer.',
            'group_id.exists' => 'Selected group does not exist.',
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
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
            $customer = DB::transaction(function () use ($id) {
                // Delete customer
                $user = User::findOrFail($id);
                return $user->update(['is_active' => 0]);
            });
            return $this->successResponse('Customer deleted successfully', $customer, 200);
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
            'is_active' => $request->is_active ? 1 : 0,
            'group_id' => $request->group_id ? $request->group_id : null,
            'updated_by' => Auth::user()->id,
        ]);

        return $user;
    }
}
