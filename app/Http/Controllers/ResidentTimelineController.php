<?php

namespace App\Http\Controllers;

use App\Models\CareRecord;
use App\Models\FamilyNote;
use App\Models\HandoverNote;
use App\Models\Resident;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ResidentTimelineController extends Controller
{
    public function show(Resident $resident): Response
    {
        $careRecords = CareRecord::query()
            ->with(['staff'])
            ->where('resident_id', $resident->id)
            ->latest('recorded_at')
            ->limit(20)
            ->get()
            ->map(fn (CareRecord $record) => [
                'id' => 'care-record-' . $record->id,
                'type' => 'care_record',
                'type_label' => '介護記録',
                'title' => $record->record_type->label(),
                'content' => $record->content,
                'date' => $record->recorded_at->format('Y-m-d H:i'),
                'staff_name' => $record->staff->name,
                'url' => route('care-records.show', $record->id),
                'is_important' => $record->is_important,
            ]);

        $handovers = HandoverNote::query()
            ->with(['creator'])
            ->where('resident_id', $resident->id)
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn (HandoverNote $note) => [
                'id' => 'handover-' . $note->id,
                'type' => 'handover',
                'type_label' => '申し送り',
                'title' => $note->title,
                'content' => $note->content,
                'date' => $note->created_at->format('Y-m-d H:i'),
                'staff_name' => $note->creator->name,
                'url' => route('handovers.show', $note->id),
                'importance_label' => $note->importance->label(),
            ]);

        $familyNotes = FamilyNote::query()
            ->with(['staff'])
            ->where('resident_id', $resident->id)
            ->latest('note_date')
            ->limit(20)
            ->get()
            ->map(fn (FamilyNote $note) => [
                'id' => 'family-note-' . $note->id,
                'type' => 'family_note',
                'type_label' => '家族向けメモ',
                'title' => $note->title,
                'content' => $note->content,
                'date' => $note->note_date->format('Y-m-d'),
                'staff_name' => $note->staff->name,
                'url' => route('family-notes.show', $note->id),
                'category_label' => $note->category->label(),
                'status_label' => $note->status->label(),
            ]);

        $timelineItems = Collection::make()
            ->merge($careRecords)
            ->merge($handovers)
            ->merge($familyNotes)
            ->sortByDesc('date')
            ->values();

        return Inertia::render('residents/timeline', [
            'resident' => [
                'id' => $resident->id,
                'resident_code' => $resident->resident_code,
                'name' => $resident->name,
                'room_number' => $resident->room_number,
                'status_label' => $resident->status->label(),
            ],
            'timelineItems' => $timelineItems,
        ]);
    }
}