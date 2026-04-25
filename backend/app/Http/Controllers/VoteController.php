<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoteRequest;
use App\Services\VoteService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    use ApiResponseTrait;

    protected $voteService;

    public function __construct(VoteService $voteService)
    {
        $this->voteService = $voteService;
    }

    public function store(VoteRequest $request)
    {
        try {
            $vote = $this->voteService->castVote(
                $request->user()->id,
                $request->election_id,
                $request->candidate_id
            );

            return $this->successResponse($vote, 'Vote cast successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function results($electionId)
    {
        try {
            $results = $this->voteService->getElectionResults($electionId);
            return $this->successResponse($results);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function myVotes(Request $request)
    {
        $votes = $request->user()->votes()->with(['election', 'candidate'])->get();
        return $this->successResponse($votes);
    }

    public function checkVoted(Request $request, $electionId)
    {
        $hasVoted = $request->user()->hasVotedInElection($electionId);
        return $this->successResponse(['has_voted' => $hasVoted]);
    }
}
