import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Stats = {
    todayCareRecordCount: number;
    unreadHandoverCount: number;
    importantHandoverCount: number;
};

type CareRecord = {
    id: number;
    resident: {
        id: number;
        name: string;
        room_number: string | null;
    };
    staff: {
        id: number;
        name: string;
    };
    record_type_label: string;
    content: string;
    recorded_at: string;
    is_important: boolean;
};

type HandoverNote = {
    id: number;
    resident: {
        id: number;
        name: string;
        room_number: string | null;
    } | null;
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
    stats: Stats;
    recentCareRecords: CareRecord[];
    unreadHandovers: HandoverNote[];
};

export default function Dashboard({
    stats,
    recentCareRecords,
    unreadHandovers,
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        今日の記録と確認が必要な申し送りを確認します。
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-white p-5">
                        <p className="text-sm text-muted-foreground">
                            今日の介護記録
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.todayCareRecordCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            本日記録された件数
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white p-5">
                        <p className="text-sm text-muted-foreground">
                            未読申し送り
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.unreadHandoverCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            まだ確認していない申し送り
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white p-5">
                        <p className="text-sm text-muted-foreground">
                            重要申し送り
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.importantHandoverCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            重要・緊急の申し送り
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-lg border bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                最近の介護記録
                            </h2>

                            <Link
                                href={route('care-records.index')}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                一覧へ
                            </Link>
                        </div>

                        {recentCareRecords.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                介護記録はありません。
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentCareRecords.map((record) => (
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
                                                <p className="font-medium">
                                                    {record.resident.name}
                                                    {record.resident.room_number
                                                        ? `（${record.resident.room_number}）`
                                                        : ''}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {record.recorded_at} /{' '}
                                                    {record.staff.name}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                    {
                                                        record.record_type_label
                                                    }
                                                </span>

                                                {record.is_important && (
                                                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                        重要
                                                    </span>
                                                )}
                                            </div>
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
                                未読申し送り
                            </h2>

                            <Link
                                href={route('handovers.index')}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                一覧へ
                            </Link>
                        </div>

                        {unreadHandovers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                未読の申し送りはありません。
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {unreadHandovers.map((note) => (
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
                                                <p className="font-medium">
                                                    {note.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    作成者：
                                                    {note.creator.name} /{' '}
                                                    {note.created_at}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {note.importance_label}
                                            </span>
                                        </div>

                                        <p className="mb-2 text-xs text-muted-foreground">
                                            対象：
                                            {note.resident
                                                ? `${note.resident.name}${
                                                      note.resident.room_number
                                                          ? `（${note.resident.room_number}）`
                                                          : ''
                                                  }`
                                                : '全体共有'}
                                        </p>

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