<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true

    // 'allowed_headers' => ['*'
    //     // 'X-Custom-Header',
    //     // 'Upgrade-Insecure-Requests',
    //     // 'Content-Type',
    //     // 'Origin',
    //     // 'Authorization',
    //     // 'X-Requested-With',
    //     // 'X-CSRF-TOKEN',
    // ],
];
