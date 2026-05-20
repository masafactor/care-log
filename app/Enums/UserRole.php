<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Manager = 'manager';
    case Nurse = 'nurse';
    case CareWorker = 'care_worker';
    case Viewer = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::Admin => '管理者',
            self::Manager => '施設管理者',
            self::Nurse => '看護師',
            self::CareWorker => '介護職員',
            self::Viewer => '閲覧のみ',
        };
    }
}