<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\GroupController;
use App\Http\Controllers\Admin\OrdersController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:60,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:60,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('stores', StoreController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/tokens/revoke', [AuthController::class, 'revokeAllTokens']);

    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('products', AdminProductController::class);
    Route::get('/category', [AdminCategoryController::class, 'dropdownCategory']);
    Route::apiResource('/customers', CustomerController::class);
    Route::apiResource('/groups', GroupController::class);
    Route::get('/groupsdrop', [GroupController::class, 'getAllGroups']);
    Route::apiResource('orders', OrdersController::class);
});
