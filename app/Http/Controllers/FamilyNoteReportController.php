<?php

namespace App\Http\Controllers;

use App\Enums\FamilyNoteStatus;
use App\Models\FamilyNote;
use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FamilyNoteReportController extends Controller
{
    public function index(Request $request): Response
    {
        $residentId = $request->query('resident_id');
        $month = $request->query('month', now()->format('Y-m'));

        $selectedResident = null;
        $familyNotes = collect();

        if ($residentId) {
            $startDate = Carbon::parse($month . '-01')->startOfMonth();
            $endDate = Carbon::parse($month . '-01')->endOfMonth();

            $selectedResident = Resident::query()->find($residentId);

            $familyNotes = FamilyNote::query()
                ->with(['resident', 'staff'])
                ->where('resident_id', $residentId)
                ->whereBetween('note_date', [$startDate, $endDate])
                ->whereIn('status', [
                    FamilyNoteStatus::Shareable->value,
                    FamilyNoteStatus::Shared->value,
                ])
                ->orderBy('note_date')
                ->get()
                ->map(fn (FamilyNote $note) => [
                    'id' => $note->id,
                    'category_label' => $note->category->label(),
                    'title' => $note->title,
                    'content' => $note->content,
                    'note_date' => $note->note_date->format('Y-m-d'),
                    'status_label' => $note->status->label(),
                    'staff' => [
                        'id' => $note->staff->id,
                        'name' => $note->staff->name,
                    ],
                ]);
        }

        return Inertia::render('family-notes/report', [
            'residents' => Resident::query()
                ->orderBy('resident_code')
                ->orderBy('name')
                ->get()
                ->map(fn (Resident $resident) => [
                    'id' => $resident->id,
                    'name' => $resident->name,
                    'resident_code' => $resident->resident_code,
                    'room_number' => $resident->room_number,
                ]),
            'selectedResident' => $selectedResident ? [
                'id' => $selectedResident->id,
                'name' => $selectedResident->name,
                'resident_code' => $selectedResident->resident_code,
                'room_number' => $selectedResident->room_number,
            ] : null,
            'familyNotes' => $familyNotes,
            'filters' => [
                'resident_id' => $residentId,
                'month' => $month,
            ],
        ]);
    }
}