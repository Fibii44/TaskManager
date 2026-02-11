<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Both admins and employees can update status
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|string|in:pending,in_progress,completed',
        ];
    }
}