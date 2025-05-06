<?php

namespace App\Listeners;

use App\Events\UserLoggedOut;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class LogUserLogout
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
    public function handle(UserLoggedOut $event): void
    {
        // Log activity to user_activities table
        DB::table('user_activities')->insert([
            'user_id' => $event->user->id,
            'activity' => 'User logged out',
            'created_at' => now(),
        ]);
    }
}
