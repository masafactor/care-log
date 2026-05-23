<?php

namespace App\Application\Residents\UseCases;

use App\Models\Resident;

class UpdateResidentUseCase
{
    public function handle(Resident $resident, array $data): Resident
    {
        $resident->update($data);

        return $resident;
    }
}