<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    protected $table = 'groups';

    protected $fillable = [
        'name',
        'status',
        'created_by',
        'updated_by'
    ];

    public function group()
    {
        return $this->hasMany(User::class, 'group_id');
    }
}
