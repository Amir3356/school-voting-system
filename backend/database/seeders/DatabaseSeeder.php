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

    }
}
