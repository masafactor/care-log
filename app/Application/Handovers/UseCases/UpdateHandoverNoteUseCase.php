<?php

namespace App\Application\Handovers\UseCases;

use App\Models\HandoverNote;

class UpdateHandoverNoteUseCase
{
    public function handle(HandoverNote $handoverNote, array $data): HandoverNote
    {
        $handoverNote->update([
            'resident_id' => $data['resident_id'] ?? null,
            'title' => $data['title'],
            'content' => $data['content'],
            'importance' => $data['importance'],
            'due_at' => $data['due_at'] ?? null,
        ]);

        return $handoverNote->refresh();
    }
}