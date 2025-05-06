<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Notifications\WelcomeEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class LogUserRegistration implements ShouldQueue
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
    public function handle(UserRegistered $event): void
    {
        DB::table('user_activities')->insert([
            'user_id' => $event->user->id,
            'activity' => 'User registered',
            'created_at' => now(),
        ]);

        // Send welcome email (or email verification if using MustVerifyEmail)
        if ($event->user->hasVerifiedEmail()) {
            Notification::send($event->user, new WelcomeEmail($event->user));
        } else {
            $event->user->sendEmailVerificationNotification();
        }
    }
}
