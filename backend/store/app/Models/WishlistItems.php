<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistItems extends Model
{
    /** @use HasFactory<\Database\Factories\WishlistItemsFactory> */
    use HasFactory;

    protected $fillable = ['wishlist_id', 'product_id', 'created_by'];

    // Relationships
    public function wishlist()
    {
        return $this->belongsTo(Wishlist::class);
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
