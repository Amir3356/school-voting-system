<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ElectionResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $election;
    public $results;

    public function __construct($data)
    {
        $this->user = $data['user'];
        $this->election = $data['election'];
        $this->results = $data['results'];
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Election Results - ' . $this->election->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.election-result',
        );
    }
}
