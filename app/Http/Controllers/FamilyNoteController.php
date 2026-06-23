<?php

namespace App\Http\Controllers;

use App\Enums\FamilyNoteCategory;
use App\Enums\FamilyNoteStatus;
use App\Http\Requests\StoreFamilyNoteRequest;
use App\Http\Requests\UpdateFamilyNoteRequest;
use App\Models\FamilyNote;
use App\Models\Resident;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Application\AuditLogs\UseCases\CreateAuditLogUseCase;
class FamilyNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');

        $familyNotes = FamilyNote::query()
            ->with(['resident', 'staff'])
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%")
                        ->orWhereHas('resident', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('resident_code', 'like', "%{$search}%");
                        });
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest('note_date')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (FamilyNote $note) => [
                'id' => $note->id,
                'resident' => [
                    'id' => $note->resident->id,
                    'name' => $note->resident->name,
                    'resident_code' => $note->resident->resident_code,
                    'room_number' => $note->resident->room_number,
                ],
                'staff' => [
                    'id' => $note->staff->id,
                    'name' => $note->staff->name,
                ],
                'category' => $note->category->value,
                'category_label' => $note->category->label(),
                'title' => $note->title,
                'note_date' => $note->note_date->format('Y-m-d'),
                'status' => $note->status->value,
                'status_label' => $note->status->label(),
                'created_at' => $note->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('family-notes/index', [
            'familyNotes' => $familyNotes,
            'categories' => $this->categoryOptions(),
            'statuses' => $this->statusOptions(),
            'filters' => [
                'search' => $search,
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('family-notes/create', [
            'residents' => $this->residentOptions(),
            'categories' => $this->categoryOptions(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function store(
        StoreFamilyNoteRequest $request,
        CreateAuditLogUseCase $auditLogUseCase
    ): RedirectResponse {
        $familyNote = FamilyNote::query()->create([
            ...$request->validated(),
            'staff_id' => $request->user()->id,
        ]);

        $auditLogUseCase->handle(
            request: $request,
            action: 'family_note.created',
            targetType: FamilyNote::class,
            targetId: $familyNote->id,
            description: "家族向けメモ「{$familyNote->title}」を作成しました。",
        );

        return redirect()
            ->route('family-notes.show', $familyNote)
            ->with('success', '家族向けメモを作成しました。');
    }

    public function show(FamilyNote $familyNote): Response
    {
        $familyNote->load(['resident', 'staff']);

        return Inertia::render('family-notes/show', [
            'familyNote' => [
                'id' => $familyNote->id,
                'resident' => [
                    'id' => $familyNote->resident->id,
                    'name' => $familyNote->resident->name,
                    'resident_code' => $familyNote->resident->resident_code,
                    'room_number' => $familyNote->resident->room_number,
                ],
                'staff' => [
                    'id' => $familyNote->staff->id,
                    'name' => $familyNote->staff->name,
                ],
                'category' => $familyNote->category->value,
                'category_label' => $familyNote->category->label(),
                'title' => $familyNote->title,
                'content' => $familyNote->content,
                'note_date' => $familyNote->note_date->format('Y-m-d'),
                'status' => $familyNote->status->value,
                'status_label' => $familyNote->status->label(),
                'created_at' => $familyNote->created_at->format('Y-m-d H:i'),
                'updated_at' => $familyNote->updated_at->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(FamilyNote $familyNote): Response
    {
        return Inertia::render('family-notes/edit', [
            'familyNote' => [
                'id' => $familyNote->id,
                'resident_id' => $familyNote->resident_id,
                'category' => $familyNote->category->value,
                'title' => $familyNote->title,
                'content' => $familyNote->content,
                'note_date' => $familyNote->note_date->format('Y-m-d'),
                'status' => $familyNote->status->value,
            ],
            'residents' => $this->residentOptions(),
            'categories' => $this->categoryOptions(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(
        UpdateFamilyNoteRequest $request,
        FamilyNote $familyNote,
        CreateAuditLogUseCase $auditLogUseCase
    ): RedirectResponse {
        $familyNote->update($request->validated());

        $auditLogUseCase->handle(
            request: $request,
            action: 'family_note.updated',
            targetType: FamilyNote::class,
            targetId: $familyNote->id,
            description: "家族向けメモ「{$familyNote->title}」を更新しました。",
        );

        return redirect()
            ->route('family-notes.show', $familyNote)
            ->with('success', '家族向けメモを更新しました。');
    }

    private function residentOptions(): array
    {
        return Resident::query()
            ->orderBy('resident_code')
            ->orderBy('name')
            ->get()
            ->map(fn (Resident $resident) => [
                'id' => $resident->id,
                'name' => $resident->name,
                'resident_code' => $resident->resident_code,
                'room_number' => $resident->room_number,
            ])
            ->all();
    }

    private function categoryOptions(): array
    {
        return collect(FamilyNoteCategory::cases())
            ->map(fn (FamilyNoteCategory $category) => [
                'value' => $category->value,
                'label' => $category->label(),
            ])
            ->all();
    }

    private function statusOptions(): array
    {
        return collect(FamilyNoteStatus::cases())
            ->map(fn (FamilyNoteStatus $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ])
            ->all();
    }
}