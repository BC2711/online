<?php

namespace App\Listeners;

use App\Events\UserLoggedIn;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class LogUserLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserLoggedIn $event): void
    {
        // Log activity to user_activities table
        DB::table('user_activities')->insert([
            'user_id' => $event->user->id,
            'activity' => 'User logged in',
            'created_at' => now(),
        ]);
    }
}
