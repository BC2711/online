<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'quantity_in_stock' => $this->quantity_in_stock,
            'weight' => $this->weight,
            'is_active' => $this->is_active,            
            'category_id' => $this->categories->pluck('id'),
            'category_name' => $this->categories->pluck('name'),
            'images' => ProductImageResource::collection($this->images),
            // 'category_id' => ProductCategoryResource::collection($this->categories),
        ];
    }
}
