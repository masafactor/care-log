<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('care_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->cascadeOnDelete();
            $table->foreignId('staff_id')->constrained('users')->cascadeOnDelete();
            $table->string('record_type');
            $table->text('content');
            $table->dateTime('recorded_at');
            $table->boolean('is_important')->default(false);
            $table->boolean('is_voided')->default(false);
            $table->text('voided_reason')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('voided_at')->nullable();
            $table->timestamps();

            $table->index(['resident_id', 'recorded_at']);
            $table->index(['record_type', 'recorded_at']);
            $table->index('is_important');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('care_records');
    }
};