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

class HandoverNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notes = HandoverNote::query()
            ->with(['resident', 'creator', 'reads'])
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
                'due_at' => $note->due_at?->format('Y-m-d H:i'),
                'created_at' => $note->created_at->format('Y-m-d H:i'),
                'is_read' => $note->isReadBy($user),
                'read_count' => $note->reads->count(),
            ]);

        return Inertia::render('handovers/index', [
            'notes' => $notes,
        ]);
    }

    public function create(): Response
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
        $handover->load(['resident', 'creator', 'reads.user']);

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
}