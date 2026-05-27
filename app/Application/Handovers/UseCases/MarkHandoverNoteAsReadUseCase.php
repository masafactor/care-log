<?php

namespace App\Application\Handovers\UseCases;

use App\Models\HandoverNote;
use App\Models\HandoverNoteRead;
use App\Models\User;
use Illuminate\Support\Carbon;

class MarkHandoverNoteAsReadUseCase
{
    public function handle(HandoverNote $handoverNote, User $user): void
    {
        HandoverNoteRead::updateOrCreate(
            [
                'handover_note_id' => $handoverNote->id,
                'user_id' => $user->id,
            ],
            [
                'read_at' => Carbon::now(),
            ]
        );
    }
}