<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient',
        'subject',
        'type',
        'status',
        'error_message',
        'sent_at'
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime'
        ];
    }
}
