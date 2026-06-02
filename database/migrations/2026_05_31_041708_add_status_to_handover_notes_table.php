<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('handover_notes', function (Blueprint $table) {
            $table->string('status')->default('open')->after('importance');
            $table->foreignId('completed_by')->nullable()->after('due_at')->constrained('users')->nullOnDelete();
            $table->dateTime('completed_at')->nullable()->after('completed_by');

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('handover_notes', function (Blueprint $table) {
            $table->dropForeign(['completed_by']);
            $table->dropIndex(['status', 'created_at']);
            $table->dropColumn(['status', 'completed_by', 'completed_at']);
        });
    }
};