<?php

namespace App\Http\Requests;

use App\Enums\CareRecordType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCareRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'record_type' => [
                'required',
                Rule::in(array_column(CareRecordType::cases(), 'value')),
            ],
            'content' => ['required', 'string', 'max:5000'],
            'recorded_at' => ['required', 'date'],
            'is_important' => ['boolean'],
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => '修正理由は必須です。',
        ];
    }
}