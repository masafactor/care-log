<?php

namespace App\Http\Controllers;

use App\Application\Residents\UseCases\CreateResidentUseCase;
use App\Application\Residents\UseCases\UpdateResidentUseCase;
use App\Enums\ResidentStatus;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use App\Models\Resident;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\CareRecord;
use App\Models\HandoverNote;
use Illuminate\Http\Request;

class ResidentController extends Controller
{

    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $residents = Resident::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('name_kana', 'like', "%{$search}%")
                        ->orWhere('room_number', 'like', "%{$search}%");
                });
            })
            ->orderBy('room_number')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Resident $resident) => [
                'id' => $resident->id,
                'name' => $resident->name,
                'name_kana' => $resident->name_kana,
                'room_number' => $resident->room_number,
                'care_level' => $resident->care_level,
                'status' => $resident->status->value,
                'status_label' => $resident->status->label(),
                'birth_date' => $resident->birth_date?->format('Y-m-d'),
                'gender' => $resident->gender,
            ]);

        return Inertia::render('residents/index', [
            'residents' => $residents,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('residents/create', [
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function store(StoreResidentRequest $request, CreateResidentUseCase $useCase)
    {
        $useCase->handle($request->validated());

        return redirect()
            ->route('residents.index')
            ->with('success', '利用者を登録しました。');
    }


    public function show(Request $request, Resident $resident): Response
    {
        $careRecords = CareRecord::query()
            ->with(['staff'])
            ->where('resident_id', $resident->id)
            ->where('is_voided', false)
            ->latest('recorded_at')
            ->limit(10)
            ->get()
            ->map(fn (CareRecord $record) => [
                'id' => $record->id,
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

        $handoverNotes = HandoverNote::query()
            ->with(['creator'])
            ->where('resident_id', $resident->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (HandoverNote $note) => [
                'id' => $note->id,
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

        return Inertia::render('residents/show', [
            'returnUrl' => $request->query('return_url'),
            'resident' => [
                'id' => $resident->id,
                'name' => $resident->name,
                'name_kana' => $resident->name_kana,
                'room_number' => $resident->room_number,
                'care_level' => $resident->care_level,
                'status' => $resident->status->value,
                'status_label' => $resident->status->label(),
                'birth_date' => $resident->birth_date?->format('Y-m-d'),
                'gender' => $resident->gender,
                'note' => $resident->note,
            ],
            'careRecords' => $careRecords,
            'handoverNotes' => $handoverNotes,
        ]);
    }

    public function edit(Resident $resident): Response
    {
        return Inertia::render('residents/edit', [
            'resident' => [
                'id' => $resident->id,
                'name' => $resident->name,
                'name_kana' => $resident->name_kana,
                'room_number' => $resident->room_number,
                'care_level' => $resident->care_level,
                'status' => $resident->status->value,
                'birth_date' => $resident->birth_date?->format('Y-m-d'),
                'gender' => $resident->gender,
                'note' => $resident->note,
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(
        UpdateResidentRequest $request,
        Resident $resident,
        UpdateResidentUseCase $useCase
    ) {
        $useCase->handle($resident, $request->validated());

        return redirect()
            ->route('residents.show', $resident)
            ->with('success', '利用者情報を更新しました。');
    }

    private function statusOptions(): array
    {
        return collect(ResidentStatus::cases())
            ->map(fn (ResidentStatus $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ])
            ->values()
            ->all();
    }
}