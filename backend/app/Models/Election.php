<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Election extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'is_active',
        'max_votes_per_user'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function isActive()
    {
        return (bool) $this->is_active;
    }

    public function hasEnded()
    {
        return !$this->is_active;
    }

    public function getTotalVotesAttribute()
    {
        return $this->votes()->count();
    }

    public function getTurnoutPercentageAttribute()
    {
        $totalStudents = User::where('role', 'student')->where('is_active', true)->count();
        return $totalStudents > 0 ? ($this->total_votes / $totalStudents) * 100 : 0;
    }
}
