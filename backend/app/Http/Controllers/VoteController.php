<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VoteConfirmationMail;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'election_id' => 'required|exists:elections,id',
        ]);

        $user = $request->user();
        $election = Election::findOrFail($validated['election_id']);

        // Check if election is active
        if (!$election->isActive()) {
            return response()->json([
                'message' => 'Election is not active'
            ], 403);
        }

        // Check if user already voted in this election
        $existingVote = Vote::where('user_id', $user->id)
            ->where('election_id', $validated['election_id'])
            ->first();

        if ($existingVote) {
            return response()->json([
                'message' => 'You have already voted in this election'
            ], 403);
        }

        // Create vote
        $vote = Vote::create([
            'user_id' => $user->id,
            'candidate_id' => $validated['candidate_id'],
            'election_id' => $validated['election_id'],
        ]);

        // Send confirmation email
        try {
            $candidate = Candidate::find($validated['candidate_id']);
            Mail::to($user->email)->send(new VoteConfirmationMail($user, $candidate, $election));
        } catch (\Exception $e) {
            // Log error but don't fail vote
        }

        return response()->json([
            'message' => 'Vote submitted successfully',
            'vote' => $vote,
        ], 201);
    }

    public function hasVoted(Request $request, $electionId)
    {
        $hasVoted = Vote::where('user_id', $request->user()->id)
            ->where('election_id', $electionId)
            ->exists();

        return response()->json([
            'has_voted' => $hasVoted
        ]);
    }
}
