<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Amir',
            'email' => 'amirsiraj1995@gmail.com',
            'password' => Hash::make('AEHJSS36'),
            'role' => 'admin',
            'is_active' => true
        ]);

        // Create sample students
        User::create([
            'name' => 'John Doe',
            'email' => 'john@school.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'student_id' => 'STU001',
            'grade' => '10',
            'section' => 'A',
            'is_active' => true
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@school.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'student_id' => 'STU002',
            'grade' => '10',
            'section' => 'B',
            'is_active' => true
        ]);
    }
}
