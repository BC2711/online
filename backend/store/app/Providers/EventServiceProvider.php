<?php

namespace App\Providers;

use App\Events\UserLoggedIn;
use App\Events\UserLoggedOut;
use App\Events\UserRegistered;
use App\Listeners\LogUserLogin;
use App\Listeners\LogUserLogout;
use App\Listeners\LogUserRegistration;
// use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $listen = [
        UserRegistered::class => [
            LogUserRegistration::class,
        ],
        UserLoggedIn::class => [
            LogUserLogin::class,
        ],
        UserLoggedOut::class => [
            LogUserLogout::class,
        ],
    ];



    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
