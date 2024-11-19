<?php

use App\Http\Controllers\Api\SocialLoginController;
use App\Http\Controllers\Api\LighthouseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::get('google/redirect', [SocialLoginController::class, 'redirectToGoogle'])
    ->name('google.login');
Route::get('google/callback', [SocialLoginController::class, 'handleGoogleCallback'])
    ->name('google.callback');

    Route::post('/lighthouse', [LighthouseController::class, 'analyze']);
