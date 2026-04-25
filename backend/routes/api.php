<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\ElectionController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Elections
    Route::get('/elections', [ElectionController::class, 'index']);
    Route::get('/elections/active', [ElectionController::class, 'active']);
    Route::get('/elections/{id}', [ElectionController::class, 'show']);

    // Candidates
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/candidates/{id}', [CandidateController::class, 'show']);

    // Voting
    Route::post('/vote', [VoteController::class, 'store']);
    Route::get('/vote/check/{electionId}', [VoteController::class, 'hasVoted']);

    // Results
    Route::get('/results', [ResultController::class, 'index']);
    Route::get('/statistics', [ResultController::class, 'statistics']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Elections management
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);

        // Candidates management
        Route::post('/candidates', [CandidateController::class, 'store']);
        Route::put('/candidates/{id}', [CandidateController::class, 'update']);
        Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);
    });
});
