<?php

namespace App\Application\Handovers\UseCases;

use App\Enums\HandoverStatus;
use App\Models\HandoverNote;
use App\Models\User;
use Illuminate\Support\Carbon;

class CompleteHandoverNoteUseCase
{
    public function handle(HandoverNote $handoverNote, User $user): HandoverNote
    {
        $handoverNote->update([
            'status' => HandoverStatus::Completed,
            'completed_by' => $user->id,
            'completed_at' => Carbon::now(),
        ]);

        return $handoverNote->refresh();
    }
}