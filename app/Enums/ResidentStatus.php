<?php

namespace App\Enums;

enum ResidentStatus: string
{
    case Active = 'active';
    case Discharged = 'discharged';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::Active => '入所中',
            self::Discharged => '退所済み',
            self::Suspended => '一時停止',
        };
    }
}