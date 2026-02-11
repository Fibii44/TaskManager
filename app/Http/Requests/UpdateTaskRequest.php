<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow admins to update tasks
        return auth()->check() && auth()->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'user_ids'    => 'required|array|min:1',
            'user_ids.*'  => 'exists:users,id',
        ];
    }

    /**
     * Custom messages for the update process.
     */
    public function messages(): array
    {
        return [
            'user_ids.min' => 'A task must have at least one employee assigned.',
            'title.required' => 'The task title cannot be empty.',
        ];
    }
}