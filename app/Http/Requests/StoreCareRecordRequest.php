<?php

namespace App\Http\Requests;

use App\Enums\CareRecordType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCareRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'record_type' => [
                'required',
                Rule::in(array_column(CareRecordType::cases(), 'value')),
            ],
            'content' => ['required', 'string', 'max:5000'],
            'recorded_at' => ['required', 'date'],
            'is_important' => ['boolean'],
        ];
    }
}