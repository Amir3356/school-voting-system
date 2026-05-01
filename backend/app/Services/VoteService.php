<?php

namespace App\Services;

use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\User;
use App\Mail\VoteConfirmedMail;
use App\Traits\NotificationTrait;

class VoteService
{
    use NotificationTrait;

    public function castVote($userId, $electionId, $candidateId)
    {
        $user = User::findOrFail($userId);
        $election = Election::findOrFail($electionId);
        $candidate = Candidate::findOrFail($candidateId);

        // Validate election is active
        if (!$election->is_active) {
            throw new \Exception('This election is not currently active');
        }

        // Check if user already voted
        if ($user->hasVotedInElection($electionId)) {
            throw new \Exception('You have already voted in this election');
        }

        // Validate candidate belongs to election
        if ($candidate->election_id !== $election->id) {
            throw new \Exception('Invalid candidate for this election');
        }

        // Create vote
        $vote = Vote::create([
            'user_id' => $userId,
            'election_id' => $electionId,
            'candidate_id' => $candidateId,
            'voted_at' => now()
        ]);

        // Send confirmation email
        $this->sendEmailNotification(
            $user->email,
            'Vote Confirmation',
            VoteConfirmedMail::class,
            [
                'user' => $user,
                'election' => $election,
                'candidate' => $candidate
            ]
        );

        return $vote;
    }

    public function getElectionResults($electionId)
    {
        $election = Election::with(['candidates.votes'])->findOrFail($electionId);

        $results = $election->candidates->map(function ($candidate) {
            return [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'position' => $candidate->position,
                'votes' => $candidate->vote_count,
                'percentage' => $candidate->vote_percentage
            ];
        })->sortByDesc('votes')->values();

        return [
            'election' => $election,
            'results' => $results,
            'total_votes' => $election->total_votes,
            'turnout_percentage' => $election->turnout_percentage
        ];
    }
}
