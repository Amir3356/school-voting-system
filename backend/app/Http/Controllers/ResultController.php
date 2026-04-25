<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $electionId = $request->query('election_id');

        if (!$electionId) {
            return response()->json(['message' => 'Election ID required'], 400);
        }

        $election = Election::findOrFail($electionId);

        $candidates = Candidate::where('election_id', $electionId)
            ->withCount('votes')
            ->orderBy('votes_count', 'desc')
            ->get();

        $totalVotes = Vote::where('election_id', $electionId)->count();

        $results = $candidates->map(function ($candidate) use ($totalVotes) {
            return [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'position' => $candidate->position,
                'description' => $candidate->description,
                'image' => $candidate->image,
                'vote_count' => $candidate->votes_count,
                'percentage' => $totalVotes > 0 ? round(($candidate->votes_count / $totalVotes) * 100, 2) : 0,
            ];
        });

        return response()->json([
            'election' => $election,
            'total_votes' => $totalVotes,
            'results' => $results,
        ]);
    }

    public function statistics(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalElections = Election::count();
        $activeElections = Election::where('status', 'active')->count();
        $totalVotes = Vote::count();
        $totalCandidates = Candidate::count();

        return response()->json([
            'total_elections' => $totalElections,
            'active_elections' => $activeElections,
            'total_votes' => $totalVotes,
            'total_candidates' => $totalCandidates,
        ]);
    }
}
