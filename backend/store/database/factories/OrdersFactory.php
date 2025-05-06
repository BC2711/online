<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Orders>
 */
class OrdersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'total_amount' => $this->faker->randomFloat(2, 50, 500),
            'shipping_amount' => $this->faker->randomFloat(2, 5, 20),
            'tax_amount' => $this->faker->randomFloat(2, 1, 15),
            'discount_amount' => 0,
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'bank_transfer']),
            'shipping_address_id' => \App\Models\Address::factory(),
            'billing_address_id' => \App\Models\Address::factory(),
            'tracking_number' => $this->faker->optional(0.7)->bothify('TRACK-#####-???'),
            'notes' => $this->faker->optional()->sentence(),
            'deleted_by' => null,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
