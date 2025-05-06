<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_cartegory_mapping extends Model
{
    /** @use HasFactory<\Database\Factories\ProductCartegoryMappingFactory> */
    use HasFactory;
    protected $table = 'product_category_mappings';

    protected $fillable = [
        'product_id',
        'category_id',
        'created_by'
    ];
}
