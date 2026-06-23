import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type FamilyNote = {
    id: number;
    resident: {
        id: number;
        name: string;
        resident_code: string | null;
        room_number: string | null;
    };
    staff: {
        id: number;
        name: string;
    };
    category: string;
    category_label: string;
    title: string;
    content: string;
    note_date: string;
    status: string;
    status_label: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    familyNote: FamilyNote;
};

export default function FamilyNotesShow({ familyNote }: Props) {
    const [copied, setCopied] = useState(false);

    const shareText = [
        `【${familyNote.note_date}】${familyNote.category_label}`,
        '',
        familyNote.title,
        '',
        familyNote.content,
    ].join('\n');

    const copyShareText = async () => {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <AppLayout>
            <Head title="家族向けメモ詳細" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            家族向けメモ詳細
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            ご家族向けに記録した近況メモを確認します。
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={route('family-notes.edit', familyNote.id)}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            編集
                        </Link>

                        <Link
                            href={route('family-notes.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                利用者
                            </p>
                            <p className="mt-1 font-medium">
                                {familyNote.resident.name}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {familyNote.resident.resident_code ??
                                    '管理番号なし'}{' '}
                                / {familyNote.resident.room_number ?? '-'}号室
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                記録者
                            </p>
                            <p className="mt-1 font-medium">
                                {familyNote.staff.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                メモ日付
                            </p>
                            <p className="mt-1 font-medium">
                                {familyNote.note_date}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                カテゴリ
                            </p>
                            <p className="mt-1 font-medium">
                                {familyNote.category_label}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                状態
                            </p>
                            <p className="mt-1">
                                <span className="rounded-full border px-2 py-0.5 text-xs">
                                    {familyNote.status_label}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                更新日時
                            </p>
                            <p className="mt-1 font-medium">
                                {familyNote.updated_at}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <p className="text-sm text-muted-foreground">
                        タイトル
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                        {familyNote.title}
                    </h2>

                    <div className="mt-6">
                        <p className="text-sm text-muted-foreground">
                            内容
                        </p>
                        <div className="mt-2 whitespace-pre-wrap rounded-md border bg-gray-50 p-4 leading-7">
                            {familyNote.content}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold">
                                    家族向け共有文面
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    面会時・電話連絡・共有用メモとして使える文面です。
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={copyShareText}
                                className="rounded-md border px-4 py-2 text-sm"
                            >
                                {copied ? 'コピーしました' : 'コピー'}
                            </button>
                        </div>

                        <div className="mt-4 whitespace-pre-wrap rounded-md border bg-gray-50 p-4 leading-7">
                            {shareText}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}