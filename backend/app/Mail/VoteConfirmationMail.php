<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Candidate;
use App\Models\Election;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VoteConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $candidate;
    public $election;

    public function __construct(User $user, Candidate $candidate, Election $election)
    {
        $this->user = $user;
        $this->candidate = $candidate;
        $this->election = $election;
    }

    public function build()
    {
        return $this->subject('Vote Confirmation - ' . $this->election->title)
            ->view('emails.vote-confirmation');
    }
}
