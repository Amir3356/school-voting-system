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
        User::firstOrCreate(
            ['email' => 'amirsiraj1995@gmail.com'],
            [
                'name' => 'Amir',
                'password' => Hash::make('AEHJSS36'),
                'role' => 'admin',
                'is_active' => true
            ]
        );

        // Create sample students
        User::firstOrCreate(
            ['email' => 'john@school.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'student',
                'student_id' => 'STU001',
                'grade' => '10',
                'section' => 'A',
                'is_active' => true
            ]
        );

        User::firstOrCreate(
            ['email' => 'jane@school.com'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'role' => 'student',
                'student_id' => 'STU002',
                'grade' => '10',
                'section' => 'B',
                'is_active' => true
            ]
        );
    }
}
