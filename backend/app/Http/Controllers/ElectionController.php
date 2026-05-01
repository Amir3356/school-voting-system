<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
            'end_date' => 'required|date',
            'max_votes_per_user' => 'integer|min:1'
        ]);

        // Normalize datetime-local input (e.g. "2026-04-01T21:16") to application timezone
        if (!empty($validated['start_date'])) {
            if (strpos($validated['start_date'], 'T') !== false) {
                $dt = Carbon::createFromFormat('Y-m-d\TH:i', $validated['start_date'], config('app.timezone'));
            } else {
                $dt = Carbon::parse($validated['start_date'], config('app.timezone'));
            }
            $validated['start_date'] = $dt->toDateTimeString();
        }

        if (!empty($validated['end_date'])) {
            if (strpos($validated['end_date'], 'T') !== false) {
                $dt = Carbon::createFromFormat('Y-m-d\TH:i', $validated['end_date'], config('app.timezone'));
            } else {
                $dt = Carbon::parse($validated['end_date'], config('app.timezone'));
            }
            $validated['end_date'] = $dt->toDateTimeString();
        }

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
            'end_date' => 'date',
            'is_active' => 'boolean',
            'max_votes_per_user' => 'integer|min:1'
        ]);

        // Normalize incoming datetime values before update
        if (!empty($validated['start_date'])) {
            if (strpos($validated['start_date'], 'T') !== false) {
                $dt = Carbon::createFromFormat('Y-m-d\TH:i', $validated['start_date'], config('app.timezone'));
            } else {
                $dt = Carbon::parse($validated['start_date'], config('app.timezone'));
            }
            $validated['start_date'] = $dt->toDateTimeString();
        }

        if (!empty($validated['end_date'])) {
            if (strpos($validated['end_date'], 'T') !== false) {
                $dt = Carbon::createFromFormat('Y-m-d\TH:i', $validated['end_date'], config('app.timezone'));
            } else {
                $dt = Carbon::parse($validated['end_date'], config('app.timezone'));
            }
            $validated['end_date'] = $dt->toDateTimeString();
        }

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
