<?php

namespace App\Application\CareRecords\UseCases;

use App\Models\CareRecord;
use App\Models\User;

class CreateCareRecordUseCase
{
    public function handle(array $data, User $staff): CareRecord
    {
        return CareRecord::create([
            'resident_id' => $data['resident_id'],
            'staff_id' => $staff->id,
            'record_type' => $data['record_type'],
            'content' => $data['content'],
            'recorded_at' => $data['recorded_at'],
            'is_important' => $data['is_important'] ?? false,
        ]);
    }
}