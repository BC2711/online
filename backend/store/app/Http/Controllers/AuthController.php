<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;
use App\Events\UserRegistered;
use App\Events\UserLoggedIn;
use App\Events\UserLoggedOut;

class AuthController extends Controller
{
    /**
     * AuthController constructor.
     * Apply rate limiting to login and register endpoints.
     */
    // public function __construct()
    // {
    //     $this->middlware('throttle:10,1')->only('login', 'register');
    // }

    /**
     * Register a new user and issue an API token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'name' => 'required|string|max:255', // For username
            'email' => 'required|email|unique:users,email|max:255',
            'phone' => 'required|string|regex:/^[0-9]{10}$/|unique:users,phone|max:10',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        try {
            return DB::transaction(function () use ($request) {
                $user = $this->createUser($request);
                $token = $user->createToken('auth_token', ['read', 'write'])->plainTextToken;

                // Dispatch event for user registration
                event(new UserRegistered($user));

                return $this->successResponse(
                    'Registration successful',
                    ['user' => new UserResource($user), 'token' => $token],
                    201
                );
            });
        } catch (\Throwable $th) {
            Log::error('Registration error: ' . $th->getMessage(), ['exception' => $th]);
            return $this->errorResponse('Registration failed', 500);
        }
    }

    /**
     * Authenticate a user and issue an API token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors());
        }

        try {
            return DB::transaction(function () use ($request) {
                if (!Auth::attempt($request->only('email', 'password'))) {
                    return $this->errorResponse('Invalid credentials', 401, [
                        'email' => ['The provided credentials are incorrect.'],
                    ]);
                }

                $user = Auth::user();

                if (!$user->is_active) {
                    return $this->errorResponse('User account is inactive', 403);
                }

                // Update last login timestamp
                $user->update(['last_login' => now()]);

                $token = $user->createToken('auth_token', ['read', 'write'])->plainTextToken;

                // Dispatch event for user login
                event(new UserLoggedIn($user));

                return $this->successResponse(
                    'Login successful',
                    ['user' => new UserResource($user), 'token' => $token],
                    200
                );
            });
        } catch (\Throwable $th) {
            Log::error('Login error: ' . $th->getMessage(), ['exception' => $th]);
            return $this->errorResponse('Login failed', 500, $th->getMessage());
        }
    }

    /**
     * Log out the authenticated user and revoke the current token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->errorResponse('User not found', 404);
            }

            return DB::transaction(function () use ($user) {
                $user->currentAccessToken()->delete();

                // Dispatch event for user logout
                event(new UserLoggedOut($user));

                return $this->successResponse('Logout successful', null, 200);
            });
        } catch (\Throwable $th) {
            Log::error('Logout error: ' . $th->getMessage(), ['exception' => $th]);
            return $this->errorResponse('Logout failed', 500);
        }
    }

    /**
     * Retrieve the authenticated user's details.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        return $this->successResponse(
            'User details retrieved successfully',
            ['user' => new UserResource($request->user())],
            200
        );
    }

    /**
     * Revoke all API tokens for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function revokeAllTokens(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->errorResponse('User not found', 404);
            }

            $user->tokens()->delete();

            return $this->successResponse('All tokens revoked successfully', null, 200);
        } catch (\Throwable $th) {
            Log::error('Token revocation error: ' . $th->getMessage(), ['exception' => $th]);
            return $this->errorResponse('Token revocation failed', 500);
        }
    }

    /**
     * Create a new user record.
     *
     * @param Request $request
     * @return User
     */
    private function createUser(Request $request)
    {
        return User::create([
            'first_name' => trim($request->first_name),
            'last_name' => trim($request->last_name),
            'username' => trim($request->name),
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'is_active' => config('auth.default_user_status', 1),
            'last_login' => now(),
            'created_by' => Auth::id() ?? 1,
        ]);
    }

    /**
     * Return a standardized success response.
     *
     * @param string $message
     * @param mixed $data
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse(string $message, $data = null, int $status = 200)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Return a standardized error response.
     *
     * @param string $message
     * @param int $status
     * @param mixed $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse(string $message, int $status, $errors = null)
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
