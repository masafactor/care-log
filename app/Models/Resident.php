<?php

namespace App\Models;

use App\Enums\ResidentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resident extends Model
{
    protected $fillable = [
        'name',
        'name_kana',
        'room_number',
        'care_level',
        'status',
        'birth_date',
        'gender',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'status' => ResidentStatus::class,
            'birth_date' => 'date',
            'care_level' => 'integer',
        ];
    }

    public function isActive(): bool
    {
        return $this->status === ResidentStatus::Active;
    }

    public function careRecords(): HasMany
    {
        return $this->hasMany(CareRecord::class);
    }
}