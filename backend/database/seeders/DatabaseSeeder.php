<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'student_id' => 'ADMIN001',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create sample student
        User::create([
            'name' => 'John Doe',
            'email' => 'student@school.com',
            'student_id' => 'STU001',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
    }
}
