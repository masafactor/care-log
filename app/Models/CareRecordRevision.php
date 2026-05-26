<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareRecordRevision extends Model
{
    protected $fillable = [
        'care_record_id',
        'edited_by',
        'old_content',
        'new_content',
        'old_record_type',
        'new_record_type',
        'old_recorded_at',
        'new_recorded_at',
        'old_is_important',
        'new_is_important',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'old_recorded_at' => 'datetime',
            'new_recorded_at' => 'datetime',
            'old_is_important' => 'boolean',
            'new_is_important' => 'boolean',
        ];
    }

    public function careRecord(): BelongsTo
    {
        return $this->belongsTo(CareRecord::class);
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
}