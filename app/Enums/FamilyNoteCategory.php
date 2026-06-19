<?php

namespace App\Enums;

enum FamilyNoteCategory: string
{
    case Daily = 'daily';
    case Meal = 'meal';
    case Condition = 'condition';
    case Rehabilitation = 'rehabilitation';
    case Exercise = 'exercise';
    case Event = 'event';
    case Visit = 'visit';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Daily => '日常',
            self::Meal => '食事',
            self::Condition => '体調',
            self::Rehabilitation => 'リハビリ',
            self::Exercise => '運動',
            self::Event => 'イベント',
            self::Visit => '面会',
            self::Other => 'その他',
        };
    }
}