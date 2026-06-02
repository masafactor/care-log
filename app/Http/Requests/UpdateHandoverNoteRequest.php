<?php

namespace App\Http\Requests;

use App\Enums\HandoverImportance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHandoverNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['nullable', 'exists:residents,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:5000'],
            'importance' => [
                'required',
                Rule::in(array_column(HandoverImportance::cases(), 'value')),
            ],
            'due_at' => ['nullable', 'date'],
        ];
    }
}