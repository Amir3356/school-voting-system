<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $electionId = $request->query('election_id');
        
        $query = Candidate::with('user');
        
        if ($electionId) {
            $query->whereHas('votes', function ($q) use ($electionId) {
                $q->where('election_id', $electionId);
            });
        }
        
        $candidates = $query->get();
        
        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'required|string',
            'description' => 'nullable|string',
            'election_id' => 'required|exists:elections,id',
        ]);

        $candidate = Candidate::create([
            'user_id' => $request->user_id,
            'position' => $request->position,
            'description' => $request->description,
            'vote_count' => 0,
        ]);

        return response()->json($candidate, 201);
    }

    public function show($id)
    {
        $candidate = Candidate::with('user')->findOrFail($id);
        return response()->json($candidate);
    }

    public function update(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);
        
        $request->validate([
            'position' => 'sometimes|string',
            'description' => 'sometimes|string',
            'image' => 'sometimes|string',
        ]);

        $candidate->update($request->only(['position', 'description', 'image']));

        return response()->json($candidate);
    }

    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();

        return response()->json(['message' => 'Candidate deleted successfully']);
    }
}
