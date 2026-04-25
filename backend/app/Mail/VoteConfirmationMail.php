<?php

namespace App\Mail;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vote Confirmation - School Voting System',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.vote-confirmation',
        );
    }
}
