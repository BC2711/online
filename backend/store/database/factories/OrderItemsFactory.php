<?php

namespace Database\Factories;

use App\Models\Orders;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order_items>
 */
class OrderItemsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $unitPrice = $this->faker->randomFloat(2, 1, 100);
        $quantity = $this->faker->numberBetween(1, 10);
        $discountPrice = $this->faker->optional(0.3, 0)->randomFloat(2, 1, 20); // 30% chance of discount

        return [
            'order_id' => Orders::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'discount_price' => $discountPrice,
            'total_price' => ($unitPrice * $quantity) - $discountPrice,
            'created_by' => User::factory(),
            // 'updated_by' => User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
