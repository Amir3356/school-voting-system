<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\Vote;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VoteConfirmationMail;

class VoteController extends Controller
{
    public function castVote(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'election_id' => 'required|exists:elections,id',
            'position' => 'required|string',
        ]);

        $user = Auth::user();
        $candidate = Candidate::findOrFail($request->candidate_id);
        $election = Election::findOrFail($request->election_id);

        // Check if election is active
        if (!$election->isActive()) {
            return response()->json(['message' => 'Election is not active'], 403);
        }

        // Check if user already voted for this position in this election
        $existingVote = Vote::where('voter_id', $user->id)
            ->where('election_id', $request->election_id)
            ->where('position', $request->position)
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You have already voted for this position'], 403);
        }

        // Create vote
        $vote = Vote::create([
            'voter_id' => $user->id,
            'candidate_id' => $request->candidate_id,
            'election_id' => $request->election_id,
            'position' => $request->position,
        ]);

        // Increment candidate vote count
        $candidate->incrementVote();

        // Mark user as voted
        $user->update(['has_voted' => true]);

        // Send email confirmation
        Mail::to($user->email)->send(new VoteConfirmationMail($user, $candidate, $election));

        return response()->json([
            'message' => 'Vote cast successfully',
            'vote' => $vote,
        ], 201);
    }

    public function getResults($electionId)
    {
        $election = Election::with('candidates')->findOrFail($electionId);
        
        $candidates = Candidate::whereHas('votes', function ($query) use ($electionId) {
            $query->where('election_id', $electionId);
        })->withCount('votes')->get();

        return response()->json([
            'election' => $election,
            'candidates' => $candidates,
        ]);
    }

    public function getMyVotes(Request $request)
    {
        $votes = Vote::with('candidate.user', 'election')
            ->where('voter_id', $request->user()->id)
            ->get();

        return response()->json($votes);
    }
}
