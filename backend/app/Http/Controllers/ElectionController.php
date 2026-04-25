<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $elections = Election::with('candidates')->latest()->get();
        return $this->successResponse($elections);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'max_votes_per_user' => 'integer|min:1'
        ]);

        $election = Election::create($validated);
        return $this->successResponse($election, 'Election created successfully', 201);
    }

    public function show($id)
    {
        $election = Election::with(['candidates', 'votes'])->findOrFail($id);
        return $this->successResponse($election);
    }

    public function update(Request $request, $id)
    {
        $election = Election::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'is_active' => 'boolean',
            'max_votes_per_user' => 'integer|min:1'
        ]);

        $election->update($validated);
        return $this->successResponse($election, 'Election updated successfully');
    }

    public function destroy($id)
    {
        $election = Election::findOrFail($id);
        $election->delete();
        return $this->successResponse(null, 'Election deleted successfully');
    }

    public function active()
    {
        $elections = Election::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->with('candidates')
            ->get();

        return $this->successResponse($elections);
    }
}
