<?php

namespace App\Application\Handovers\UseCases;

use App\Models\HandoverNote;
use App\Models\User;

class CreateHandoverNoteUseCase
{
    public function handle(array $data, User $creator): HandoverNote
    {
        return HandoverNote::create([
            'resident_id' => $data['resident_id'] ?? null,
            'created_by' => $creator->id,
            'title' => $data['title'],
            'content' => $data['content'],
            'importance' => $data['importance'],
            'due_at' => $data['due_at'] ?? null,
        ]);
    }
}