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

class ResidentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('residents/index', [
            'residents' => Resident::query()
                ->latest()
                ->get()
                ->map(fn (Resident $resident) => [
                    'id' => $resident->id,
                    'name' => $resident->name,
                    'name_kana' => $resident->name_kana,
                    'room_number' => $resident->room_number,
                    'care_level' => $resident->care_level,
                    'status' => $resident->status->value,
                    'status_label' => $resident->status->label(),
                    'birth_date' => $resident->birth_date?->format('Y-m-d'),
                ]),
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

    public function show(Resident $resident): Response
    {
        return Inertia::render('residents/show', [
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