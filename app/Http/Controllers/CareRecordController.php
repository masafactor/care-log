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
use App\Application\CareRecords\UseCases\UpdateCareRecordUseCase;
use App\Http\Requests\UpdateCareRecordRequest;

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


    public function create(Request $request): Response
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
            'selectedResidentId' => $request->query('resident_id'),
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
        $careRecord->load([
            'resident',
            'staff',
            'revisions.editor',
        ]);

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
                'revisions' => $careRecord->revisions
                    ->sortByDesc('created_at')
                    ->values()
                    ->map(fn ($revision) => [
                        'id' => $revision->id,
                        'editor' => [
                            'id' => $revision->editor->id,
                            'name' => $revision->editor->name,
                        ],
                        'old_content' => $revision->old_content,
                        'new_content' => $revision->new_content,
                        'old_record_type' => $revision->old_record_type,
                        'new_record_type' => $revision->new_record_type,
                        'old_recorded_at' => $revision->old_recorded_at?->format('Y-m-d H:i'),
                        'new_recorded_at' => $revision->new_recorded_at?->format('Y-m-d H:i'),
                        'old_is_important' => $revision->old_is_important,
                        'new_is_important' => $revision->new_is_important,
                        'reason' => $revision->reason,
                        'created_at' => $revision->created_at->format('Y-m-d H:i'),
                    ]),
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

    public function edit(CareRecord $careRecord): Response
    {
        $careRecord->load(['resident', 'staff']);

        return Inertia::render('care-records/edit', [
            'record' => [
                'id' => $careRecord->id,
                'resident' => [
                    'id' => $careRecord->resident->id,
                    'name' => $careRecord->resident->name,
                    'room_number' => $careRecord->resident->room_number,
                ],
                'record_type' => $careRecord->record_type->value,
                'content' => $careRecord->content,
                'recorded_at' => $careRecord->recorded_at->format('Y-m-d\TH:i'),
                'is_important' => $careRecord->is_important,
            ],
            'recordTypes' => $this->recordTypeOptions(),
        ]);
    }

    public function update(
        UpdateCareRecordRequest $request,
        CareRecord $careRecord,
        UpdateCareRecordUseCase $useCase
    ): RedirectResponse {
        $useCase->handle(
            $careRecord,
            $request->validated(),
            $request->user()
        );

        return redirect()
            ->route('care-records.show', $careRecord)
            ->with('success', '介護記録を修正しました。');
    }
}