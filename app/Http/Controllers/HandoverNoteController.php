<?php

namespace App\Http\Controllers;

use App\Application\Handovers\UseCases\CreateHandoverNoteUseCase;
use App\Application\Handovers\UseCases\MarkHandoverNoteAsReadUseCase;
use App\Enums\HandoverImportance;
use App\Http\Requests\StoreHandoverNoteRequest;
use App\Models\HandoverNote;
use App\Models\Resident;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Application\Handovers\UseCases\CompleteHandoverNoteUseCase;
use App\Application\Handovers\UseCases\UpdateHandoverNoteUseCase;
use App\Http\Requests\UpdateHandoverNoteRequest;
use App\Enums\HandoverStatus;

class HandoverNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $search = $request->query('search');
        $importance = $request->query('importance');
        $status = $request->query('status');

        $notes = HandoverNote::query()
            ->with(['resident', 'creator', 'reads'])
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%")
                        ->orWhereHas('resident', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('name_kana', 'like', "%{$search}%")
                                ->orWhere('room_number', 'like', "%{$search}%");
                        });
                });
            })
            ->when($importance, function ($query, $importance) {
                $query->where('importance', $importance);
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get()
            ->map(fn (HandoverNote $note) => [
                'id' => $note->id,
                'resident' => $note->resident
                    ? [
                        'id' => $note->resident->id,
                        'name' => $note->resident->name,
                        'room_number' => $note->resident->room_number,
                    ]
                    : null,
                'creator' => [
                    'id' => $note->creator->id,
                    'name' => $note->creator->name,
                ],
                'title' => $note->title,
                'content' => $note->content,
                'importance' => $note->importance->value,
                'importance_label' => $note->importance->label(),
                'status' => $note->status->value,
                'status_label' => $note->status->label(),
                'due_at' => $note->due_at?->format('Y-m-d H:i'),
                'created_at' => $note->created_at->format('Y-m-d H:i'),
                'completed_at' => $note->completed_at?->format('Y-m-d H:i'),
                'is_read' => $note->isReadBy($user),
                'read_count' => $note->reads->count(),
            ]);

        return Inertia::render('handovers/index', [
            'notes' => $notes,
            'importanceOptions' => $this->importanceOptions(),
            'statusOptions' => collect(HandoverStatus::cases())
                ->map(fn (HandoverStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values()
                ->all(),
            'filters' => [
                'search' => $search,
                'importance' => $importance,
                'status' => $status,
            ],
        ]);
}

    public function create(Request $request): Response
    {
        return Inertia::render('handovers/create', [
            'residents' => Resident::query()
                ->orderBy('room_number')
                ->get(['id', 'name', 'room_number'])
                ->map(fn (Resident $resident) => [
                    'id' => $resident->id,
                    'name' => $resident->name,
                    'room_number' => $resident->room_number,
                ]),
            'importanceOptions' => $this->importanceOptions(),
            'selectedResidentId' => $request->query('resident_id'),
        ]);
    }

    public function store(
        StoreHandoverNoteRequest $request,
        CreateHandoverNoteUseCase $useCase
    ): RedirectResponse {
        $note = $useCase->handle($request->validated(), $request->user());

        return redirect()
            ->route('handovers.show', $note)
            ->with('success', '申し送りを作成しました。');
    }

    public function show(HandoverNote $handover): Response
    {

        $handover->load(['resident', 'creator', 'reads.user', 'completedBy']);
        return Inertia::render('handovers/show', [
            'note' => [
                'id' => $handover->id,
                'resident' => $handover->resident
                    ? [
                        'id' => $handover->resident->id,
                        'name' => $handover->resident->name,
                        'room_number' => $handover->resident->room_number,
                    ]
                    : null,
                'creator' => [
                    'id' => $handover->creator->id,
                    'name' => $handover->creator->name,
                ],
                'title' => $handover->title,
                'content' => $handover->content,
                'importance' => $handover->importance->value,
                'importance_label' => $handover->importance->label(),
                'due_at' => $handover->due_at?->format('Y-m-d H:i'),
                'created_at' => $handover->created_at->format('Y-m-d H:i'),
                'reads' => $handover->reads
                    ->sortByDesc('read_at')
                    ->values()
                    ->map(fn ($read) => [
                        'id' => $read->id,
                        'user' => [
                            'id' => $read->user->id,
                            'name' => $read->user->name,
                        ],
                        'read_at' => $read->read_at->format('Y-m-d H:i'),
                    ]),
            ],
            'status' => $handover->status->value,
            'status_label' => $handover->status->label(),
            'completed_by' => $handover->completedBy
                ? [
                    'id' => $handover->completedBy->id,
                    'name' => $handover->completedBy->name,
                ]
                : null,
            'completed_at' => $handover->completed_at?->format('Y-m-d H:i'),
        ]);
    }

    public function markAsRead(
        HandoverNote $handover,
        Request $request,
        MarkHandoverNoteAsReadUseCase $useCase
    ): RedirectResponse {
        $useCase->handle($handover, $request->user());

        return back()->with('success', '申し送りを既読にしました。');
    }

    private function importanceOptions(): array
    {
        return collect(HandoverImportance::cases())
            ->map(fn (HandoverImportance $importance) => [
                'value' => $importance->value,
                'label' => $importance->label(),
            ])
            ->values()
            ->all();
    }

    public function edit(HandoverNote $handover): Response
{
    return Inertia::render('handovers/edit', [
        'note' => [
            'id' => $handover->id,
            'resident_id' => $handover->resident_id,
            'title' => $handover->title,
            'content' => $handover->content,
            'importance' => $handover->importance->value,
            'due_at' => $handover->due_at?->format('Y-m-d\TH:i'),
        ],
        'residents' => Resident::query()
            ->orderBy('room_number')
            ->get(['id', 'name', 'room_number'])
            ->map(fn (Resident $resident) => [
                'id' => $resident->id,
                'name' => $resident->name,
                'room_number' => $resident->room_number,
            ]),
        'importanceOptions' => $this->importanceOptions(),
    ]);
}

    public function update(
        UpdateHandoverNoteRequest $request,
        HandoverNote $handover,
        UpdateHandoverNoteUseCase $useCase
    ): RedirectResponse {
        $useCase->handle($handover, $request->validated());

        return redirect()
            ->route('handovers.show', $handover)
            ->with('success', '申し送りを更新しました。');
    }

    public function complete(
        HandoverNote $handover,
        Request $request,
        CompleteHandoverNoteUseCase $useCase
    ): RedirectResponse {
        $useCase->handle($handover, $request->user());

        return back()->with('success', '申し送りを完了にしました。');
    }
}