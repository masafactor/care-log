<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::query()
            ->with(['user'])
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
                'action' => $log->action,
                'target_type' => $log->target_type,
                'target_id' => $log->target_id,
                'ip_address' => $log->ip_address,
                'description' => $log->description,
                'created_at' => $log->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
        ]);
    }
}