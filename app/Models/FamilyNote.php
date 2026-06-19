<?php

namespace App\Models;

use App\Enums\FamilyNoteCategory;
use App\Enums\FamilyNoteStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyNote extends Model
{
    protected $fillable = [
        'resident_id',
        'staff_id',
        'category',
        'title',
        'content',
        'note_date',
        'status',
    ];

    protected $casts = [
        'category' => FamilyNoteCategory::class,
        'status' => FamilyNoteStatus::class,
        'note_date' => 'date',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}