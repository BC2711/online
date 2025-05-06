<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'sku',
        'price',
        'discount_price',
        'quantity_in_stock',
        'weight',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    // Relationships
    public function categories()
    {
        return $this->belongsToMany(ProductCategory::class, 'product_category_mappings', 'product_id', 'category_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function reviews()
    {
        return $this->hasMany(Product_review::class, 'product_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'product_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItems::class, 'product_id');
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistItems::class, 'product_id');
    }

    // Audit relationships
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
