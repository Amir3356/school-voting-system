<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'election_id',
        'name',
        'student_id',
        'grade',
        'section',
        'position',
        'bio',
        'photo_url',
        'manifesto'
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function getVoteCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getVotePercentageAttribute()
    {
        $totalVotes = $this->election->total_votes;
        return $totalVotes > 0 ? ($this->vote_count / $totalVotes) * 100 : 0;
    }
}
