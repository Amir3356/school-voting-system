<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->string('position');
            $table->timestamps();
            
            $table->unique(['voter_id', 'election_id', 'position'], 'unique_vote_per_position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
