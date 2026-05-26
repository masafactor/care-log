<?php

namespace App\Application\CareRecords\UseCases;

use App\Models\CareRecord;
use App\Models\CareRecordRevision;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateCareRecordUseCase
{
    public function handle(CareRecord $careRecord, array $data, User $editor): CareRecord
    {
        return DB::transaction(function () use ($careRecord, $data, $editor) {
            CareRecordRevision::create([
                'care_record_id' => $careRecord->id,
                'edited_by' => $editor->id,
                'old_content' => $careRecord->content,
                'new_content' => $data['content'],
                'old_record_type' => $careRecord->record_type->value,
                'new_record_type' => $data['record_type'],
                'old_recorded_at' => $careRecord->recorded_at,
                'new_recorded_at' => $data['recorded_at'],
                'old_is_important' => $careRecord->is_important,
                'new_is_important' => $data['is_important'] ?? false,
                'reason' => $data['reason'],
            ]);

            $careRecord->update([
                'record_type' => $data['record_type'],
                'content' => $data['content'],
                'recorded_at' => $data['recorded_at'],
                'is_important' => $data['is_important'] ?? false,
            ]);

            return $careRecord->refresh();
        });
    }
}