<?php

use App\Enums\FamilyNoteCategory;
use App\Enums\FamilyNoteStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_notes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('resident_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('staff_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('category')->default(FamilyNoteCategory::Daily->value);
            $table->string('title');
            $table->text('content');
            $table->date('note_date');
            $table->string('status')->default(FamilyNoteStatus::Draft->value);

            $table->timestamps();

            $table->index(['resident_id', 'note_date']);
            $table->index(['category', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_notes');
    }
};