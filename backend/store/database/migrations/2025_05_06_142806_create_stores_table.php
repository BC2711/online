<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->comment('Store name');
            $table->string('address', 500)->comment('Store address');
            $table->string('phone', 20)->nullable()->comment('Store phone number');
            $table->string('email')->nullable()->comment('Store email address')->index();
            $table->string('website')->nullable()->comment('Store website URL');
            $table->string('logo')->nullable()->comment('Store logo URL');
            $table->enum('status', ['active', 'inactive'])->default('active')->comment('Store status');
            $table->string('currency', 3)->default('ZMW')->comment('Store currency (ISO 4217 code)');
            $table->string('timezone', 50)->default('Africa/Lusaka')->comment('Store timezone');
            $table->string('city', 100)->nullable()->comment('Store city')->index();
            $table->string('facebook')->nullable()->comment('Store Facebook URL');
            $table->string('twitter')->nullable()->comment('Store Twitter URL');
            $table->string('instagram')->nullable()->comment('Store Instagram URL');
            $table->string('tiktok')->nullable()->comment('Store TikTok URL');
            $table->string('whatsapp', 20)->nullable()->comment('Store WhatsApp number');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict')->comment('User who created the store');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null')->comment('User who last updated the store');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->onDelete('set null')->comment('User who soft-deleted the store');
            $table->softDeletes()->comment('Soft delete timestamp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
