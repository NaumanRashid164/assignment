<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    public function redirectToGoogle()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback()
    {
        try {
            $user = Socialite::driver('google')->stateless()->user();
            $token = $this->RegisterOrLoginUser($user, "google");
            return redirect(env('FRONTEND_URL') . '?token=' . $token);
        } catch (\Exception $e) {
            logger($e->getMessage());
            return redirect(env('FRONTEND_URL'));
        }
    }

    protected function RegisterOrLoginUser($data, $providerName)
    {

        $user = User::where("email", $data->email)->first();
        if (!$user) {
            $user = new User();
            $user->name = $data->name;
            $user->provider_id = $data->id;
            $user->provider_name = $providerName;
            $user->name = $data->name;
            $user->email = $data->email;
            $user->config = serialize($data->user);
            $user->save();
        }

        $token = $user->createToken('API Token')->plainTextToken;

        return $token;
    }
}
