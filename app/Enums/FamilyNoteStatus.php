<?php

namespace App\Enums;

enum FamilyNoteStatus: string
{
    case Draft = 'draft';
    case Shareable = 'shareable';
    case Shared = 'shared';

    public function label(): string
    {
        return match ($this) {
            self::Draft => '下書き',
            self::Shareable => '共有可',
            self::Shared => '共有済み',
        };
    }
}