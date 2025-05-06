<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 5);
        $search = $request->query('search', '');

        try {
            // Fetch orders with related user, addresses, and order items (including products)
            $orders = Orders::with(['user', 'shippingAddress', 'billingAddress', 'orderItems.product', 'payments', 'images.product.images'])
                ->when($search, function ($query, $search) {
                    $query->where('total_amount', 'like', "%{$search}%")
                        ->orWhere('shipping_amount', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('orderItems.product', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                })
                ->paginate($perPage);

            // Transform the data
            $transformedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'shipping_amount' => $order->shipping_amount,
                    'tax_amount' => $order->tax_amount,
                    'discount_amount' => $order->discount_amount,
                    'tracking_number' => $order->tracking_number,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at->toDateTimeString(),
                    'updated_at' => $order->updated_at->toDateTimeString(),
                    'images' => $order->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => $image->image_url,
                            'product_id' => $image->product_id,
                        ];
                    }),
                    'shipping_info' => $order->shippingAddress ? [
                        'id' => $order->shippingAddress->id,
                        'address_type' => $order->shippingAddress->address_type,
                        'street_address1' => $order->shippingAddress->street_address1,
                        'street_address2' => $order->shippingAddress->street_address2,
                        'city' => $order->shippingAddress->city,
                        'state' => $order->shippingAddress->state,
                        'country' => $order->shippingAddress->country,
                        'postal_code' => $order->shippingAddress->postal_code,
                    ] : null,
                    'payment_method' => $order->payment_method,
                    'payments' => $order->payments ? [
                        'id' => $order->id,
                        'payment_method' => $order->payment_method,
                        'amount' => $order->amount,
                        'status' => $order->status,
                        'transaction_id' => $order->transaction_id,
                        'created_at' => $order->created_at->toDateTimeString(),
                    ] : null,

                    'user' => $order->user ? [
                        'id' => $order->user->id,
                        'first_name' => $order->user->first_name,
                        'last_name' => $order->user->last_name,
                        'email' => $order->user->email,
                        'phone' => $order->user->phone,
                    ] : null,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'discount_price' => $item->discount_price,
                            'total_price' => $item->total_price,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                            ] : null,
                        ];
                    }),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedOrders,
                'links' => [
                    'first' => $orders->url(1),
                    'last' => $orders->url($orders->lastPage()),
                    'prev' => $orders->previousPageUrl(),
                    'next' => $orders->nextPageUrl(),
                ],
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'from' => $orders->firstItem(),
                    'last_page' => $orders->lastPage(),
                    'path' => $orders->path(),
                    'per_page' => $orders->perPage(),
                    'to' => $orders->lastItem(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching orders.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:255',
            'total_amount' => 'required|numeric',
            'shipping_amount' => 'nullable|numeric',
            'tax_amount' => 'nullable|numeric',
            'discount_amount' => 'nullable|numeric',
            'payment_method' => 'required|string|max:255',
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'required|exists:addresses,id',
            'user_id' => 'required|exists:users,id',
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $order = Orders::create($validated);

        return response()->json([
            'success' => true,
            'data' => $order,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Orders::with(['user', 'shippingAddress', 'billingAddress'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'shipping_amount' => $order->shipping_amount,
                'tax_amount' => $order->tax_amount,
                'discount_amount' => $order->discount_amount,
                'payment_method' => $order->payment_method,
                'shipping_address' => $order->shippingAddress ? $order->shippingAddress->street_address1 : null,
                'billing_address' => $order->billingAddress ? $order->billingAddress->street_address1 : null,
                'tracking_number' => $order->tracking_number,
                'notes' => $order->notes,
                'created_at' => $order->created_at,
                'user' => $order->user ? $order->user->first_name . ' ' . $order->user->last_name : null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|max:255',
            'total_amount' => 'nullable|numeric',
            'shipping_amount' => 'nullable|numeric',
            'tax_amount' => 'nullable|numeric',
            'discount_amount' => 'nullable|numeric',
            'payment_method' => 'nullable|string|max:255',
            'shipping_address_id' => 'nullable|exists:addresses,id',
            'billing_address_id' => 'nullable|exists:addresses,id',
            'user_id' => 'nullable|exists:users,id',
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $order = Orders::findOrFail($id);
        $order->update($validated);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Orders::findOrFail($id);
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }

    public function approve(Request $request, string $id)
    {
        $order = Orders::findOrFail($id);
        $order->update(['status' => 'approved']);

        return response()->json([
            'success' => true,
            'message' => 'Order approved successfully.',
        ]);
    }
    public function reject(Request $request, string $id)
    {
        $order = Orders::findOrFail($id);
        $order->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Order rejected successfully.',
        ]);
    }
}
