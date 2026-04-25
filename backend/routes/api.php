<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Vote routes
    Route::post('/vote', [VoteController::class, 'castVote']);
    Route::get('/results/{electionId}', [VoteController::class, 'getResults']);
    Route::get('/my-votes', [VoteController::class, 'getMyVotes']);

    // Candidate routes
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/candidates/{id}', [CandidateController::class, 'show']);

    // Admin routes (admin only)
    Route::middleware(function ($request, $next) {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $next($request);
    })->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/students', [AdminController::class, 'getStudents']);
        Route::post('/admin/students', [AdminController::class, 'addStudent']);
        Route::delete('/admin/students/{id}', [AdminController::class, 'deleteStudent']);
        Route::get('/admin/elections', [AdminController::class, 'getElections']);
        Route::post('/admin/elections', [AdminController::class, 'createElection']);
        Route::put('/admin/elections/{id}', [AdminController::class, 'updateElection']);
        Route::delete('/admin/elections/{id}', [AdminController::class, 'deleteElection']);
        Route::get('/admin/results/{electionId}', [AdminController::class, 'exportResults']);
        Route::post('/admin/candidates', [CandidateController::class, 'store']);
        Route::put('/admin/candidates/{id}', [CandidateController::class, 'update']);
        Route::delete('/admin/candidates/{id}', [CandidateController::class, 'destroy']);
    });
});
