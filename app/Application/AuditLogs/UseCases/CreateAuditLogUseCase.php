<?php

namespace App\Application\AuditLogs\UseCases;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class CreateAuditLogUseCase
{
    public function handle(
        Request $request,
        string $action,
        ?string $targetType = null,
        ?int $targetId = null,
        ?string $description = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'ip_address' => $request->ip(),
            'description' => $description,
        ]);
    }
}