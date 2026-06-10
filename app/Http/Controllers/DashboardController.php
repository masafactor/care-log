<?php

namespace App\Http\Controllers;

use App\Enums\HandoverStatus;
use App\Models\CareRecord;
use App\Models\HandoverNote;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $todayStart = Carbon::today();
        $todayEnd = Carbon::today()->endOfDay();

        $todayCareRecordCount = CareRecord::query()
            ->whereBetween('recorded_at', [$todayStart, $todayEnd])
            ->where('is_voided', false)
            ->count();

        $unreadHandoverCount = HandoverNote::query()
            ->where('status', HandoverStatus::Open->value)
            ->whereDoesntHave('reads', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->count();

        $importantHandoverCount = HandoverNote::query()
            ->where('status', HandoverStatus::Open->value)
            ->whereIn('importance', ['important', 'urgent'])
            ->count();

        $todayImportantCareRecords = CareRecord::query()
            ->with(['resident', 'staff'])
            ->whereBetween('recorded_at', [$todayStart, $todayEnd])
            ->where('is_voided', false)
            ->where('is_important', true)
            ->latest('recorded_at')
            ->limit(5)
            ->get()
            ->map(fn (CareRecord $record) => [
                'id' => $record->id,
                'resident' => [
                    'id' => $record->resident->id,
                    'resident_code' => $record->resident->resident_code,
                    'name' => $record->resident->name,
                    'room_number' => $record->resident->room_number,
                ],
                'staff' => [
                    'id' => $record->staff->id,
                    'name' => $record->staff->name,
                ],
                'record_type' => $record->record_type->value,
                'record_type_label' => $record->record_type->label(),
                'content' => $record->content,
                'recorded_at' => $record->recorded_at->format('Y-m-d H:i'),
                'is_important' => $record->is_important,
            ]);

        $recentCareRecords = CareRecord::query()
            ->with(['resident', 'staff'])
            ->where('is_voided', false)
            ->latest('recorded_at')
            ->limit(5)
            ->get()
            ->map(fn (CareRecord $record) => [
                'id' => $record->id,
                'resident' => [
                    'id' => $record->resident->id,
                    'resident_code' => $record->resident->resident_code,
                    'name' => $record->resident->name,
                    'room_number' => $record->resident->room_number,
                ],
                'staff' => [
                    'id' => $record->staff->id,
                    'name' => $record->staff->name,
                ],
                'record_type' => $record->record_type->value,
                'record_type_label' => $record->record_type->label(),
                'content' => $record->content,
                'recorded_at' => $record->recorded_at->format('Y-m-d H:i'),
                'is_important' => $record->is_important,
            ]);

        $unreadHandovers = HandoverNote::query()
            ->with(['resident', 'creator'])
            ->where('status', HandoverStatus::Open->value)
            ->whereDoesntHave('reads', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (HandoverNote $note) => [
                'id' => $note->id,
                'resident' => $note->resident ? [
                    'id' => $note->resident->id,
                    'resident_code' => $note->resident->resident_code,
                    'name' => $note->resident->name,
                    'room_number' => $note->resident->room_number,
                ] : null,
                'creator' => [
                    'id' => $note->creator->id,
                    'name' => $note->creator->name,
                ],
                'title' => $note->title,
                'content' => $note->content,
                'importance' => $note->importance->value,
                'importance_label' => $note->importance->label(),
                'due_at' => $note->due_at?->format('Y-m-d H:i'),
                'created_at' => $note->created_at->format('Y-m-d H:i'),
            ]);

        $dueSoonHandovers = HandoverNote::query()
            ->with(['resident', 'creator'])
            ->where('status', HandoverStatus::Open->value)
            ->whereNotNull('due_at')
            ->whereBetween('due_at', [
                Carbon::now(),
                Carbon::now()->addDays(3),
            ])
            ->orderBy('due_at')
            ->limit(5)
            ->get()
            ->map(fn (HandoverNote $note) => [
                'id' => $note->id,
                'resident' => $note->resident ? [
                    'id' => $note->resident->id,
                    'resident_code' => $note->resident->resident_code,
                    'name' => $note->resident->name,
                    'room_number' => $note->resident->room_number,
                ] : null,
                'creator' => [
                    'id' => $note->creator->id,
                    'name' => $note->creator->name,
                ],
                'title' => $note->title,
                'content' => $note->content,
                'importance' => $note->importance->value,
                'importance_label' => $note->importance->label(),
                'due_at' => $note->due_at?->format('Y-m-d H:i'),
                'created_at' => $note->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'todayCareRecordCount' => $todayCareRecordCount,
                'unreadHandoverCount' => $unreadHandoverCount,
                'importantHandoverCount' => $importantHandoverCount,
            ],
            'todayImportantCareRecords' => $todayImportantCareRecords,
            'recentCareRecords' => $recentCareRecords,
            'unreadHandovers' => $unreadHandovers,
            'dueSoonHandovers' => $dueSoonHandovers,
        ]);
    }
}