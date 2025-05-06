<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItems extends Model
{
    /** @use HasFactory<\Database\Factories\CartItemsFactory> */
    use HasFactory;

    protected $fillable = ['cart_id', 'product_id', 'quantity', 'created_by'];

    // Relationships
    public function cart()
    {
        return $this->belongsTo(ShoppingCart::class, 'cart_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Audit relationships
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
