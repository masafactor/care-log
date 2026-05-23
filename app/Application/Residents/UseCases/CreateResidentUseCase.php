<?php

namespace App\Application\Residents\UseCases;

use App\Models\Resident;

class CreateResidentUseCase
{
    public function handle(array $data): Resident
    {
        return Resident::create($data);
    }
}