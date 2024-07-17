<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ticket_type' => 'required|string|max:255',
            "ticket_desc_concern" => "required",
            'property_no' => 'required',
            'file.*' => 'file|max:2048', // Limiting file size to 2MB (2048 kilobytes), adjust as necessary
            'document.*' => 'file|max:2048', // Limiting file size to 2MB (2048 kilobytes), adjust as necessary
            'video.*' => 'file|max:40000', // Limiting file size to 2MB (2048 kilobytes), adjust as necessary
        ];
    }
}
