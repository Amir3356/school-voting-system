<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Candidate::with('election');

        if ($request->has('election_id')) {
            $query->where('election_id', $request->election_id);
        }

        $candidates = $query->get();
        return $this->successResponse($candidates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'election_id' => 'required|exists:elections,id',
            'name' => 'required|string|max:255',
            'student_id' => 'required|string',
            'grade' => 'required|string',
            'section' => 'required|string',
            'position' => 'required|string',
            'bio' => 'nullable|string',
            'photo_url' => 'nullable|url',
            'manifesto' => 'nullable|string'
        ]);

        $candidate = Candidate::create($validated);
        return $this->successResponse($candidate, 'Candidate added successfully', 201);
    }

    public function show($id)
    {
        $candidate = Candidate::with(['election', 'votes'])->findOrFail($id);
        return $this->successResponse($candidate);
    }

    public function update(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'student_id' => 'string',
            'grade' => 'string',
            'section' => 'string',
            'position' => 'string',
            'bio' => 'nullable|string',
            'photo_url' => 'nullable|url',
            'manifesto' => 'nullable|string'
        ]);

        $candidate->update($validated);
        return $this->successResponse($candidate, 'Candidate updated successfully');
    }

    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();
        return $this->successResponse(null, 'Candidate deleted successfully');
    }
}
