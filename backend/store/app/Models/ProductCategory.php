<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory  extends Model
{
    /** @use HasFactory<\Database\Factories\ProductCartegoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'parent_category_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    // Relationships
    public function parent()
    {
        return $this->belongsTo(ProductCategory ::class, 'parent_category_id');
    }

    public function children()
    {
        return $this->hasMany(ProductCategory ::class, 'parent_category_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_category_mappings');
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
