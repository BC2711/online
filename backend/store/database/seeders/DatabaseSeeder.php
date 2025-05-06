<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

use App\Models\Product;
use App\Models\Address;
use App\Models\CartItems;
use App\Models\Wishlist;
use App\Models\Order_items;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Payments;
use App\Models\ProductImage;
use App\Models\ProductCategory;
use App\Models\shopping_cart;
use App\Models\shoppingCart;
use App\Models\WishlistItems;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Disable foreign key checks
        Schema::disableForeignKeyConstraints();

        // Truncate tables
        $tables = [
            'users',
            'product_categories',
            'products',
            'product_category_mappings',
            'addresses',
            'product_images',
            'shopping_carts',
            'cart_items',
            'wishlists',
            'wishlist_items',
            'orders',
            'order_items',
            'order_status_histories',
            'payments',
            'product_reviews'
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();

        // Create admin user
        $admin = User::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'is_active' => true,
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        // Create 50 users
        $users = User::factory()->count(50)->create();

        // Create 10 product categories
        $categories = ProductCategory::factory()->count(15)->create();

        // Assign parent categories (randomly)
        foreach ($categories->skip(3) as $category) {
            $category->update([
                'parent_category_id' => $faker->optional(0.6)->randomElement($categories->pluck('id')->toArray())
            ]);
        }

        // Create 100 products
        $products = Product::factory()->count(100)->create();

        // Assign categories to products
        foreach ($products as $product) {
            $product->categories()->attach(
                $categories->random(rand(1, 3))->pluck('id')->toArray()
            );
        }

        // Create product images (2-5 per product)
        foreach ($products as $product) {
            ProductImage::factory()->count(rand(2, 5))->create([
                'product_id' => $product->id,
                'is_primary' => false,
            ]);
            // Make one image primary
            ProductImage::factory()->create([
                'product_id' => $product->id,
                'is_primary' => true,
                'display_order' => 0,
            ]);
        }

        // Create addresses for users
        foreach ($users as $user) {
            Address::factory()->count(rand(1, 3))->create([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
        }

        // Create shopping carts and items
        foreach ($users as $user) {
            $cart = shoppingCart::create([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            CartItems::factory()->count(rand(1, 5))->create([
                'cart_id' => $cart->id,
                'created_by' => $user->id,
            ]);
        }

        // Create wishlists
        foreach ($users as $user) {
            $wishlist = Wishlist::create([
                'user_id' => $user->id,
                'name' => 'My Wishlist',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            WishlistItems::factory()->count(rand(1, 8))->create([
                'wishlist_id' => $wishlist->id,
                'created_by' => $user->id,
            ]);
        }

        // Create orders
        foreach ($users as $user) {
            $userAddresses = $user->addresses;

            for ($i = 0; $i < rand(2, 5); $i++) {
                $order = Orders::create([
                    'user_id' => $user->id,
                    'status' => $faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
                    'total_amount' => 0,
                    'shipping_amount' => $faker->randomFloat(2, 5, 20),
                    'tax_amount' => $faker->randomFloat(2, 1, 15),
                    'discount_amount' => 0,
                    'payment_method' => $faker->randomElement(['credit_card', 'paypal', 'bank_transfer']),
                    'shipping_address_id' => $userAddresses->random()->id,
                    'billing_address_id' => $userAddresses->random()->id,
                    'tracking_number' => $faker->optional(0.7)->bothify('TRACK-#####-???'),
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                ]);

                $orderItems = OrderItems::factory()->count(rand(1, 5))->create([
                    'order_id' => $order->id,
                    'created_by' => $user->id,
                ]);

                $order->update([
                    'total_amount' => $orderItems->sum('total_price') + $order->shipping_amount + $order->tax_amount - ($order->discount_amount ?? 0)
                ]);

                Payments::create([
                    'order_id' => $order->id,
                    'amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'transaction_id' => $faker->bothify('TRANS-#####-???'),
                    'status' => $order->status === 'pending' ? 'pending' : 'completed',
                    'created_by' => $user->id,
                ]);
            }
        }
    }
}
