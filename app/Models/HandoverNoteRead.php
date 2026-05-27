<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandoverNoteRead extends Model
{
    protected $fillable = [
        'handover_note_id',
        'user_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    public function handoverNote(): BelongsTo
    {
        return $this->belongsTo(HandoverNote::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}