<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\UserController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Elections
    Route::get('/elections', [ElectionController::class, 'index']);
    Route::get('/elections/active', [ElectionController::class, 'active']);
    Route::get('/elections/{id}', [ElectionController::class, 'show']);

    // Candidates
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/candidates/{id}', [CandidateController::class, 'show']);

    // Voting (Student only)
    Route::middleware('student')->group(function () {
        Route::post('/votes', [VoteController::class, 'store']);
        Route::get('/votes/my-votes', [VoteController::class, 'myVotes']);
        Route::get('/votes/check/{electionId}', [VoteController::class, 'checkVoted']);
    });

    // Results (accessible to all authenticated users)
    Route::get('/votes/results/{electionId}', [VoteController::class, 'results']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);

        Route::post('/candidates', [CandidateController::class, 'store']);
        Route::put('/candidates/{id}', [CandidateController::class, 'update']);
        Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);

        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });
});
