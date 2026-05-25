<?php

namespace App\Enums;

enum CareRecordType: string
{
    case Meal = 'meal';
    case Excretion = 'excretion';
    case Bathing = 'bathing';
    case Medication = 'medication';
    case Vital = 'vital';
    case Condition = 'condition';
    case Sleep = 'sleep';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Meal => '食事',
            self::Excretion => '排泄',
            self::Bathing => '入浴',
            self::Medication => '服薬',
            self::Vital => 'バイタル',
            self::Condition => '体調',
            self::Sleep => '睡眠',
            self::Other => 'その他',
        };
    }
}