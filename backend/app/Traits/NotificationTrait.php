<?php

namespace App\Traits;

use App\Models\NotificationLog;
use Illuminate\Support\Facades\Mail;

trait NotificationTrait
{
    protected function sendEmailNotification($to, $subject, $mailableClass, $data = [])
    {
        try {
            Mail::to($to)->send(new $mailableClass($data));
            
            $this->logNotification($to, $subject, 'email', 'sent');
            
            return true;
        } catch (\Exception $e) {
            $this->logNotification($to, $subject, 'email', 'failed', $e->getMessage());
            
            return false;
        }
    }

    protected function logNotification($recipient, $subject, $type, $status, $error = null)
    {
        NotificationLog::create([
            'recipient' => $recipient,
            'subject' => $subject,
            'type' => $type,
            'status' => $status,
            'error_message' => $error,
            'sent_at' => now()
        ]);
    }
}
