<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Mail\WelcomeMail;
use App\Traits\ApiResponseTrait;
use App\Traits\NotificationTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponseTrait, NotificationTrait;

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'student_id' => $request->student_id,
            'grade' => $request->grade,
            'section' => $request->section
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Send welcome email
        $this->sendEmailNotification(
            $user->email,
            'Welcome to School Voting System',
            WelcomeMail::class,
            ['user' => $user]
        );

        return $this->successResponse([
            'user' => $user,
            'token' => $token
        ], 'Registration successful', 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->unauthorizedResponse('Invalid credentials');
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if (!$user->is_active) {
            return $this->forbiddenResponse('Your account is inactive');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Logged out successfully');
    }

    public function me(Request $request)
    {
        return $this->successResponse($request->user());
    }
}
