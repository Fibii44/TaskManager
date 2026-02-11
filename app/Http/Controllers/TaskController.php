<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Events\TaskUpdated;
// --- IMPORT THE NEW REQUESTS ---
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;

class TaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $is_admin = $user->role === 'admin';

        return Inertia::render('Dashboard', [
            'employees' => $is_admin ? User::where('role', 'employee')->get() : [],
            'tasks' => $is_admin 
                ? Task::with('users')->latest()->get() 
                : $user->tasks()->with('users')->latest()->get(),
            'role' => $user->role
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        // Logic only runs if validation in StoreTaskRequest passes
        $task = Task::create($request->validated());
        $task->users()->sync($request->user_ids);

        event(new TaskUpdated()); 
        return back()->with('success', 'Task created successfully!');
    }

    // Add this method inside TaskController class
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // Ensure only admins can edit task details
        if (auth()->user()->role !== 'admin') abort(403);

        // Update the main task details
        $task->update($request->validated());

        // Sync the users (assigned employees)
        if ($request->has('user_ids')) {
            $task->users()->sync($request->user_ids);
        }

        event(new \App\Events\TaskUpdated());

        return back();
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $newStatus = $request->status ?? match ($task->status) {
            'pending'     => 'in_progress',
            'in_progress' => 'completed',
            'completed'   => 'pending',
            default       => 'pending',
        };

        $task->update(['status' => $newStatus]);
        event(new TaskUpdated());
        return back();
    }

    public function destroy(Task $task)
    {
        if (auth()->user()->role !== 'admin') abort(403);
        $task->delete();
        event(new TaskUpdated());
        return back();
    }
}