<?php

namespace App\Models;

use App\Enums\CareRecordType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CareRecord extends Model
{
    protected $fillable = [
        'resident_id',
        'staff_id',
        'record_type',
        'content',
        'recorded_at',
        'is_important',
        'is_voided',
        'voided_reason',
        'voided_by',
        'voided_at',
    ];

    protected function casts(): array
    {
        return [
            'record_type' => CareRecordType::class,
            'recorded_at' => 'datetime',
            'is_important' => 'boolean',
            'is_voided' => 'boolean',
            'voided_at' => 'datetime',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function voidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voided_by');
    }

    public function isImportant(): bool
    {
        return $this->is_important;
    }

    public function isVoided(): bool
    {
        return $this->is_voided;
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(CareRecordRevision::class);
    }
}