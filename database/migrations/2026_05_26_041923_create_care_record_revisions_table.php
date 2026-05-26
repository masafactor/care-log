<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('care_record_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('care_record_id')->constrained()->cascadeOnDelete();
            $table->foreignId('edited_by')->constrained('users')->cascadeOnDelete();
            $table->text('old_content');
            $table->text('new_content');
            $table->string('old_record_type')->nullable();
            $table->string('new_record_type')->nullable();
            $table->dateTime('old_recorded_at')->nullable();
            $table->dateTime('new_recorded_at')->nullable();
            $table->boolean('old_is_important')->default(false);
            $table->boolean('new_is_important')->default(false);
            $table->text('reason');
            $table->timestamps();

            $table->index('care_record_id');
            $table->index('edited_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('care_record_revisions');
    }
};