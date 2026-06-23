import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Stats = {
    todayCareRecordCount: number;
    unreadHandoverCount: number;
    importantHandoverCount: number;
};

type Resident = {
    id: number;
    resident_code: string | null;
    name: string;
    room_number: string | null;
};

type Staff = {
    id: number;
    name: string;
};

type CareRecord = {
    id: number;
    resident: Resident;
    staff: Staff;
    record_type: string;
    record_type_label: string;
    content: string;
    recorded_at: string;
    is_important: boolean;
};

type HandoverNote = {
    id: number;
    resident: Resident | null;
    creator: Staff;
    title: string;
    content: string;
    importance: string;
    importance_label: string;
    due_at: string | null;
    created_at: string;
};

type RecentFamilyNote = {
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
    category_label: string;
    title: string;
    note_date: string;
    status_label: string;
};

type Props = {
    stats: Stats;
    todayImportantCareRecords: CareRecord[];
    recentCareRecords: CareRecord[];
    unreadHandovers: HandoverNote[];
    dueSoonHandovers: HandoverNote[];
    todayCareRecordCount: number;
    unreadHandoverCount: number;
    importantHandoverCount: number;
    todayFamilyNoteCount: number;
    shareableFamilyNoteCount: number;
    recentFamilyNotes: RecentFamilyNote[];
    
};

export default function Dashboard({
    stats,
    todayImportantCareRecords,
    recentCareRecords,
    unreadHandovers,
    dueSoonHandovers,
    todayCareRecordCount,
    unreadHandoverCount,
    importantHandoverCount,
    todayFamilyNoteCount,
    shareableFamilyNoteCount,
    recentFamilyNotes,
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-muted-foreground">
                        本日の家族向けメモ
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        {todayFamilyNoteCount}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-muted-foreground">
                        共有可能メモ
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        {shareableFamilyNoteCount}
                    </p>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        本日の状況と確認が必要な情報を表示します。
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-white p-5">
                        <p className="text-sm text-muted-foreground">
                            本日の介護記録
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.todayCareRecordCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            今日記録された介護記録数
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
                            重要または緊急の未完了申し送り
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href={route('care-records.create')}
                        className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                    >
                        <p className="font-semibold">介護記録を作成</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            食事・排泄・体調などの記録を追加します。
                        </p>
                    </Link>

                    <Link
                        href={route('handovers.create')}
                        className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                    >
                        <p className="font-semibold">申し送りを作成</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            次の勤務者へ共有事項を登録します。
                        </p>
                    </Link>

                    <Link
                        href={route('residents.index')}
                        className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                    >
                        <p className="font-semibold">利用者を確認</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            利用者情報・記録・申し送りを確認します。
                        </p>
                    </Link>

                     <Link
                        href={route('family-notes.create')}
                        className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                    >
                        <p className="font-semibold">家族向けメモを作成</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            ご家族へ伝える近況や様子を記録します。
                        </p>
                    </Link>
                </div>

                <section className="rounded-lg border bg-white">
                    <div className="border-b p-4">
                        <h2 className="font-semibold">今日の重要介護記録</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            本日記録された重要な介護記録です。
                        </p>
                    </div>

                    <div className="divide-y">
                        {todayImportantCareRecords.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">
                                今日の重要介護記録はありません。
                            </p>
                        ) : (
                            todayImportantCareRecords.map((record) => (
                                <Link
                                    key={record.id}
                                    href={route('care-records.show', record.id)}
                                    className="block p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {record.resident.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {record.resident.resident_code ?? '管理番号なし'} /{' '}
                                                {record.resident.room_number ?? '-'}号室 /{' '}
                                                {record.record_type_label}
                                            </p>
                                            <p className="mt-2 line-clamp-2 text-sm">
                                                {record.content}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right text-xs text-muted-foreground">
                                            <p>{record.recorded_at}</p>
                                            <p>記録者：{record.staff.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-lg border bg-white">
                    <div className="border-b p-4">
                        <h2 className="font-semibold">期限が近い申し送り</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            3日以内に確認期限が来る未完了の申し送りです。
                        </p>
                    </div>

                    <div className="divide-y">
                        {dueSoonHandovers.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">
                                期限が近い申し送りはありません。
                            </p>
                        ) : (
                            dueSoonHandovers.map((note) => (
                                <Link
                                    key={note.id}
                                    href={route('handovers.show', note.id)}
                                    className="block p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">
                                                    {note.title}
                                                </p>
                                                <span className="rounded-full border px-2 py-0.5 text-xs">
                                                    {note.importance_label}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {note.resident ? (
                                                    <>
                                                        {note.resident.resident_code ?? '管理番号なし'} /{' '}
                                                        {note.resident.name} /{' '}
                                                        {note.resident.room_number ?? '-'}号室
                                                    </>
                                                ) : (
                                                    '全体共有'
                                                )}
                                            </p>

                                            <p className="mt-2 line-clamp-2 text-sm">
                                                {note.content}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right text-xs text-muted-foreground">
                                            <p>期限：{note.due_at ?? '-'}</p>
                                            <p>作成者：{note.creator.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-lg border bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="font-semibold">最近の介護記録</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    最新の介護記録を表示します。
                                </p>
                            </div>

                            <Link
                                href={route('care-records.index')}
                                className="text-sm underline"
                            >
                                一覧へ
                            </Link>
                        </div>

                        <div className="divide-y">
                            {recentCareRecords.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">
                                    介護記録はまだありません。
                                </p>
                            ) : (
                                recentCareRecords.map((record) => (
                                    <Link
                                        key={record.id}
                                        href={route('care-records.show', record.id)}
                                        className="block p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium">
                                                    {record.resident.name}
                                                    {record.is_important && (
                                                        <span className="ml-2 rounded-full border px-2 py-0.5 text-xs">
                                                            重要
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {record.resident.resident_code ?? '管理番号なし'} /{' '}
                                                    {record.resident.room_number ?? '-'}号室 /{' '}
                                                    {record.record_type_label}
                                                </p>
                                                <p className="mt-2 line-clamp-2 text-sm">
                                                    {record.content}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right text-xs text-muted-foreground">
                                                <p>{record.recorded_at}</p>
                                                <p>{record.staff.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="font-semibold">未読申し送り</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    まだ確認していない申し送りです。
                                </p>
                            </div>

                            <Link
                                href={route('handovers.index')}
                                className="text-sm underline"
                            >
                                一覧へ
                            </Link>
                        </div>

                        <div className="divide-y">
                            {unreadHandovers.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">
                                    未読の申し送りはありません。
                                </p>
                            ) : (
                                unreadHandovers.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={route('handovers.show', note.id)}
                                        className="block p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {note.title}
                                                    </p>
                                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                                        {note.importance_label}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {note.resident ? (
                                                        <>
                                                            {note.resident.resident_code ?? '管理番号なし'} /{' '}
                                                            {note.resident.name} /{' '}
                                                            {note.resident.room_number ?? '-'}号室
                                                        </>
                                                    ) : (
                                                        '全体共有'
                                                    )}
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-sm">
                                                    {note.content}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right text-xs text-muted-foreground">
                                                <p>{note.created_at}</p>
                                                <p>{note.creator.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        
                    </section>

                                        <section className="rounded-lg border bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="font-semibold">
                                    最近の家族向けメモ
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    ご家族へ共有する近況メモです。
                                </p>
                            </div>

                            <Link
                                href={route('family-notes.index')}
                                className="text-sm underline"
                            >
                                一覧へ
                            </Link>
                        </div>

                        <div className="divide-y">
                            {(recentFamilyNotes ?? []).length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">
                                    家族向けメモはまだありません。
                                </p>
                            ) : (
                                (recentFamilyNotes ?? []).map((note) =>(
                                    <Link
                                        key={note.id}
                                        href={route('family-notes.show', note.id)}
                                        className="block p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium">
                                                    {note.title}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {note.resident.resident_code ?? '管理番号なし'} /{' '}
                                                    {note.resident.name} /{' '}
                                                    {note.resident.room_number ?? '-'}号室
                                                </p>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {note.category_label} / 記録者：{note.staff.name}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right text-xs text-muted-foreground">
                                                <p>{note.note_date}</p>
                                                <p className="mt-1 rounded-full border px-2 py-0.5">
                                                    {note.status_label}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                    
                </div>
            </div>
        </AppLayout>
    );
}