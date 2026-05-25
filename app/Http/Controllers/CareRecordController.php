<?php

namespace App\Http\Controllers;

use App\Application\CareRecords\UseCases\CreateCareRecordUseCase;
use App\Enums\CareRecordType;
use App\Http\Requests\StoreCareRecordRequest;
use App\Models\CareRecord;
use App\Models\Resident;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CareRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $records = CareRecord::query()
            ->with(['resident', 'staff'])
            ->where('is_voided', false)
            ->latest('recorded_at')
            ->get()
            ->map(fn (CareRecord $record) => [
                'id' => $record->id,
                'resident' => [
                    'id' => $record->resident->id,
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

        return Inertia::render('care-records/index', [
            'records' => $records,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('care-records/create', [
            'residents' => Resident::query()
                ->orderBy('room_number')
                ->get(['id', 'name', 'room_number'])
                ->map(fn (Resident $resident) => [
                    'id' => $resident->id,
                    'name' => $resident->name,
                    'room_number' => $resident->room_number,
                ]),
            'recordTypes' => $this->recordTypeOptions(),
        ]);
    }

    public function store(
        StoreCareRecordRequest $request,
        CreateCareRecordUseCase $useCase
    ): RedirectResponse {
        $record = $useCase->handle($request->validated(), $request->user());

        return redirect()
            ->route('care-records.show', $record)
            ->with('success', '介護記録を作成しました。');
    }

    public function show(CareRecord $careRecord): Response
    {
        $careRecord->load(['resident', 'staff']);

        return Inertia::render('care-records/show', [
            'record' => [
                'id' => $careRecord->id,
                'resident' => [
                    'id' => $careRecord->resident->id,
                    'name' => $careRecord->resident->name,
                    'room_number' => $careRecord->resident->room_number,
                ],
                'staff' => [
                    'id' => $careRecord->staff->id,
                    'name' => $careRecord->staff->name,
                ],
                'record_type' => $careRecord->record_type->value,
                'record_type_label' => $careRecord->record_type->label(),
                'content' => $careRecord->content,
                'recorded_at' => $careRecord->recorded_at->format('Y-m-d H:i'),
                'is_important' => $careRecord->is_important,
            ],
        ]);
    }

    private function recordTypeOptions(): array
    {
        return collect(CareRecordType::cases())
            ->map(fn (CareRecordType $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ])
            ->values()
            ->all();
    }
}