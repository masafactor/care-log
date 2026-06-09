import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Resident = {
    id: number;
    name: string;
    name_kana: string | null;
    room_number: string | null;
    care_level: number | null;
    status: string;
    status_label: string;
    birth_date: string | null;
    gender: string | null;
    note: string | null;
    resident_code: string | null;
};

type CareRecord = {
    id: number;
    staff: {
        id: number;
        name: string;
    };
    record_type: string;
    record_type_label: string;
    content: string;
    recorded_at: string;
    is_important: boolean;
};

type HandoverNote = {
    id: number;
    creator: {
        id: number;
        name: string;
    };
    title: string;
    content: string;
    importance: string;
    importance_label: string;
    due_at: string | null;
    created_at: string;
};

type Props = {
    resident: Resident;
    careRecords: CareRecord[];
    handoverNotes: HandoverNote[];
    returnUrl?: string | null;
};

export default function ResidentsShow({
    resident,
    careRecords,
    handoverNotes,
    returnUrl,
}: Props)  {
    return (
        <AppLayout>
            <Head title={`利用者詳細 - ${resident.name}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">利用者詳細</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            利用者の基本情報と関連記録を確認します。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('care-records.create', {
                                resident_id: resident.id,
                            })}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            介護記録を作成
                        </Link>

                        <Link
                            href={route('handovers.create', {
                                resident_id: resident.id,
                            })}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            申し送りを作成
                        </Link>

                        <Link
                            href={route('residents.edit', resident.id)}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            編集
                        </Link>

                        <Link
                            href={returnUrl ?? route('residents.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">{resident.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {resident.name_kana ?? '-'}
                        </p>
                    </div>

                    <dl className="grid gap-5 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                利用者管理番号
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.resident_code ?? '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                居室
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.room_number ?? '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                介護度
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.care_level
                                    ? `要介護${resident.care_level}`
                                    : '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                ステータス
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.status_label}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                生年月日
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.birth_date ?? '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                性別
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.gender ?? '-'}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6 border-t pt-6">
                        <dt className="text-sm text-muted-foreground">備考</dt>
                        <dd className="mt-2 whitespace-pre-wrap leading-7">
                            {resident.note ?? '-'}
                        </dd>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-lg border bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                最近の介護記録
                            </h2>

                            <Link
                                href={route('care-records.create', {
                                    resident_id: resident.id,
                                })}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                記録を追加
                            </Link>
                        </div>

                        {careRecords.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                介護記録はありません。
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {careRecords.map((record) => (
                                    <Link
                                        key={record.id}
                                        href={route(
                                            'care-records.show',
                                            record.id,
                                        )}
                                        className="block rounded-md border p-4 hover:bg-gray-50"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {record.record_type_label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {record.recorded_at} /{' '}
                                                    {record.staff.name}
                                                </p>
                                            </div>

                                            {record.is_important && (
                                                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                    重要
                                                </span>
                                            )}
                                        </div>

                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {record.content}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                関連する申し送り
                            </h2>

                            <Link
                                href={route('handovers.create', {
                                    resident_id: resident.id,
                                })}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                申し送りを追加
                            </Link>
                        </div>

                        {handoverNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                関連する申し送りはありません。
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {handoverNotes.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={route(
                                            'handovers.show',
                                            note.id,
                                        )}
                                        className="block rounded-md border p-4 hover:bg-gray-50"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {note.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {note.created_at} /{' '}
                                                    {note.creator.name}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {note.importance_label}
                                            </span>
                                        </div>

                                        {note.due_at && (
                                            <p className="mb-2 text-xs text-blue-700">
                                                期限：{note.due_at}
                                            </p>
                                        )}

                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {note.content}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}