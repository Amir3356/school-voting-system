<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return $next($request);
        });
    }

    public function dashboard()
    {
        $totalUsers = User::count();
        $totalCandidates = Candidate::count();
        $totalVotes = Vote::count();
        $activeElections = Election::where('status', 'active')->count();

        return response()->json([
            'total_users' => $totalUsers,
            'total_candidates' => $totalCandidates,
            'total_votes' => $totalVotes,
            'active_elections' => $activeElections,
        ]);
    }

    public function getStudents()
    {
        $students = User::where('role', 'student')->get();
        return response()->json($students);
    }

    public function addStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $student = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'student',
        ]);

        return response()->json($student, 201);
    }

    public function deleteStudent($id)
    {
        $student = User::findOrFail($id);
        if ($student->role !== 'student') {
            return response()->json(['message' => 'Not a student'], 400);
        }
        $student->delete();
        return response()->json(['message' => 'Student deleted']);
    }

    public function getElections()
    {
        $elections = Election::all();
        return response()->json($elections);
    }

    public function createElection(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $election = Election::create([
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'upcoming',
        ]);

        return response()->json($election, 201);
    }

    public function updateElection(Request $request, $id)
    {
        $election = Election::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|in:upcoming,active,ended',
        ]);

        $election->update($request->only(['title', 'description', 'start_date', 'end_date', 'status']));

        return response()->json($election);
    }

    public function deleteElection($id)
    {
        $election = Election::findOrFail($id);
        $election->delete();
        return response()->json(['message' => 'Election deleted']);
    }

    public function exportResults($electionId)
    {
        $election = Election::with('candidates')->findOrFail($electionId);
        $candidates = Candidate::withCount('votes')
            ->whereHas('votes', function ($query) use ($electionId) {
                $query->where('election_id', $electionId);
            })->get();

        return response()->json([
            'election' => $election,
            'results' => $candidates,
        ]);
    }
}
