<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isStudent()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Student access required.'
            ], 403);
        }

        return $next($request);
    }
}
