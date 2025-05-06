<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraphs(3, true),
            'sku' => $this->faker->unique()->bothify('SKU-####-???'),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'discount_price' => $this->faker->optional(0.3)->randomFloat(2, 5, 100),
            'quantity_in_stock' => $this->faker->numberBetween(0, 200),
            'weight' => $this->faker->randomFloat(2, 0.1, 20),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
