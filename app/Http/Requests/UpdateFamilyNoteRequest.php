<?php

namespace App\Http\Requests;

use App\Enums\FamilyNoteCategory;
use App\Enums\FamilyNoteStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateFamilyNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'category' => ['required', new Enum(FamilyNoteCategory::class)],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'note_date' => ['required', 'date'],
            'status' => ['required', new Enum(FamilyNoteStatus::class)],
        ];
    }
}