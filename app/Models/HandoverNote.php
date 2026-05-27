<?php

namespace App\Models;

use App\Enums\HandoverImportance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HandoverNote extends Model
{
    protected $fillable = [
        'resident_id',
        'created_by',
        'title',
        'content',
        'importance',
        'due_at',
    ];

    protected function casts(): array
    {
        return [
            'importance' => HandoverImportance::class,
            'due_at' => 'datetime',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reads(): HasMany
    {
        return $this->hasMany(HandoverNoteRead::class);
    }

    public function isReadBy(User $user): bool
    {
        return $this->reads->contains('user_id', $user->id);
    }
}