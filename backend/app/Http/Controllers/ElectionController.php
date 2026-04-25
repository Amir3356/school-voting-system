<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ElectionStatusMail;
use App\Models\User;

class ElectionController extends Controller
{
    public function index()
    {
        $elections = Election::with('candidates')->get();
        return response()->json($elections);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'sometimes|in:pending,active,completed',
        ]);

        $election = Election::create($validated);

        return response()->json([
            'message' => 'Election created successfully',
            'election' => $election,
        ], 201);
    }

    public function show($id)
    {
        $election = Election::with('candidates')->findOrFail($id);
        return response()->json($election);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $election = Election::findOrFail($id);
        $oldStatus = $election->status;

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|in:pending,active,completed',
        ]);

        $election->update($validated);

        // Send notification if status changed
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            try {
                $users = User::where('role', 'student')->get();
                foreach ($users as $user) {
                    Mail::to($user->email)->send(new ElectionStatusMail($election));
                }
            } catch (\Exception $e) {
                // Log error
            }
        }

        return response()->json([
            'message' => 'Election updated successfully',
            'election' => $election,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $election = Election::findOrFail($id);
        $election->delete();

        return response()->json([
            'message' => 'Election deleted successfully'
        ]);
    }

    public function active()
    {
        $election = Election::where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('candidates')
            ->first();

        return response()->json($election);
    }
}
