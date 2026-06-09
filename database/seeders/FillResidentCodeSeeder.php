<?php

namespace Database\Seeders;

use App\Models\Resident;
use Illuminate\Database\Seeder;

class FillResidentCodeSeeder extends Seeder
{
    public function run(): void
    {
        Resident::query()
            ->orderBy('id')
            ->get()
            ->each(function (Resident $resident, int $index) {
                if ($resident->resident_code) {
                    return;
                }

                $resident->update([
                    'resident_code' => 'R-' . str_pad((string) ($index + 1), 6, '0', STR_PAD_LEFT),
                ]);
            });
    }
}