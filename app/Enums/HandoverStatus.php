<?php

namespace App\Enums;

enum HandoverStatus: string
{
    case Open = 'open';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Open => '未完了',
            self::Completed => '完了',
        };
    }
}