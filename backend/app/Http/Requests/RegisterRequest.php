<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,student',
            'student_id' => 'required_if:role,student|unique:users,student_id|nullable',
            'grade' => 'required_if:role,student|nullable',
            'section' => 'required_if:role,student|nullable'
        ];
    }
}
