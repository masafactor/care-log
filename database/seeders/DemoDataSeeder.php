<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Enums\CareRecordType;
use App\Enums\HandoverImportance;
use App\Enums\HandoverStatus;
use App\Models\CareRecord;
use App\Models\HandoverNote;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@example.com')->first();

        if (! $admin) {
            $this->command->warn('admin@example.com が存在しません。先に AdminUserSeeder を実行してください。');
            return;
        }

        $residents = collect([
            ['name' => '山田 太郎', 'name_kana' => 'やまだ たろう', 'room_number' => '101', 'care_level' => 2, 'gender' => '男性'],
            ['name' => '佐藤 花子', 'name_kana' => 'さとう はなこ', 'room_number' => '102', 'care_level' => 3, 'gender' => '女性'],
            ['name' => '田中 一郎', 'name_kana' => 'たなか いちろう', 'room_number' => '201', 'care_level' => 1, 'gender' => '男性'],
            ['name' => '鈴木 春子', 'name_kana' => 'すずき はるこ', 'room_number' => '202', 'care_level' => 4, 'gender' => '女性'],
            ['name' => '高橋 健', 'name_kana' => 'たかはし けん', 'room_number' => '301', 'care_level' => 5, 'gender' => '男性'],
            ['name' => '伊藤 和子', 'name_kana' => 'いとう かずこ', 'room_number' => '302', 'care_level' => 2, 'gender' => '女性'],
            ['name' => '渡辺 正', 'name_kana' => 'わたなべ ただし', 'room_number' => '401', 'care_level' => 3, 'gender' => '男性'],
            ['name' => '小林 恵子', 'name_kana' => 'こばやし けいこ', 'room_number' => '402', 'care_level' => 1, 'gender' => '女性'],
            ['name' => '加藤 誠', 'name_kana' => 'かとう まこと', 'room_number' => '501', 'care_level' => 2, 'gender' => '男性'],
            ['name' => '吉田 洋子', 'name_kana' => 'よしだ ようこ', 'room_number' => '502', 'care_level' => 4, 'gender' => '女性'],
            ['name' => '中村 昭', 'name_kana' => 'なかむら あきら', 'room_number' => '601', 'care_level' => 3, 'gender' => '男性'],
            ['name' => '森 久美子', 'name_kana' => 'もり くみこ', 'room_number' => '602', 'care_level' => 2, 'gender' => '女性'],
        ])->map(function ($data) {
            return Resident::query()->firstOrCreate(
                ['room_number' => $data['room_number']],
                [
                    ...$data,
                    'status' => 'active',
                    'birth_date' => Carbon::now()->subYears(rand(75, 95))->subDays(rand(1, 3000)),
                    'note' => 'デモ用利用者データです。',
                ]
            );
        });

        foreach ($residents as $resident) {
            foreach (range(1, 3) as $i) {
                CareRecord::query()->create([
                    'resident_id' => $resident->id,
                    'staff_id' => $admin->id,
                    'record_type' => collect(CareRecordType::cases())->random()->value,
                    'content' => "デモ介護記録です。食事・体調・生活状況などを記録しています。{$i}",
                    'recorded_at' => Carbon::now()->subDays(rand(0, 10))->setTime(rand(7, 20), rand(0, 59)),
                    'is_important' => rand(1, 5) === 1,
                ]);
            }

            HandoverNote::query()->create([
                'resident_id' => $resident->id,
                'created_by' => $admin->id,
                'title' => "{$resident->name}さんへの申し送り",
                'content' => 'デモ申し送りです。次の勤務者へ確認事項を共有します。',
                'importance' => collect(HandoverImportance::cases())->random()->value,
                'status' => rand(1, 5) === 1
                    ? HandoverStatus::Completed->value
                    : HandoverStatus::Open->value,
                'due_at' => Carbon::now()->addDays(rand(1, 7)),
            ]);
        }
    }
}