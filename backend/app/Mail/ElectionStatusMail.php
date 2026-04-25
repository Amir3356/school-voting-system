<?php

namespace App\Mail;

use App\Models\Election;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ElectionStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $election;

    public function __construct(Election $election)
    {
        $this->election = $election;
    }

    public function build()
    {
        $subject = $this->election->status === 'active' 
            ? 'Election Started: ' . $this->election->title
            : 'Election Ended: ' . $this->election->title;

        return $this->subject($subject)
            ->view('emails.election-status');
    }
}
