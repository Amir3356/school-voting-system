<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewCandidateMail;
use App\Models\User;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $electionId = $request->query('election_id');
        
        $query = Candidate::with('election');
        
        if ($electionId) {
            $query->where('election_id', $electionId);
        }
        
        $candidates = $query->get();

        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'election_id' => 'required|exists:elections,id',
        ]);

        $candidate = Candidate::create($validated);

        // Notify all users about new candidate
        try {
            $users = User::where('role', 'student')->get();
            foreach ($users as $user) {
                Mail::to($user->email)->send(new NewCandidateMail($candidate));
            }
        } catch (\Exception $e) {
            // Log error but don't fail creation
        }

        return response()->json([
            'message' => 'Candidate created successfully',
            'candidate' => $candidate,
        ], 201);
    }

    public function show($id)
    {
        $candidate = Candidate::with('election')->findOrFail($id);
        return response()->json($candidate);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $candidate = Candidate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'election_id' => 'sometimes|exists:elections,id',
        ]);

        $candidate->update($validated);

        return response()->json([
            'message' => 'Candidate updated successfully',
            'candidate' => $candidate,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $candidate = Candidate::findOrFail($id);
        $candidate->delete();

        return response()->json([
            'message' => 'Candidate deleted successfully'
        ]);
    }
}
