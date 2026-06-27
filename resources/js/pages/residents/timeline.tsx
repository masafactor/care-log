import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type Resident = {
    id: number;
    resident_code: string | null;
    name: string;
    room_number: string | null;
    status_label: string;
};

type TimelineItem = {
    id: string;
    type: 'care_record' | 'handover' | 'family_note';
    type_label: string;
    title: string;
    content: string;
    date: string;
    staff_name: string;
    url: string;
    is_important?: boolean;
    importance_label?: string;
    category_label?: string;
    status_label?: string;
};

type Props = {
    resident: Resident;
    timelineItems: TimelineItem[];
};

export default function ResidentTimeline({
    resident,
    timelineItems,
}: Props) {
    return (
        <AppLayout>
            <Head title="利用者タイムライン" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            利用者タイムライン
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            介護記録・申し送り・家族向けメモを時系列で確認します。
                        </p>
                    </div>

                    <Link
                        href={route('residents.show', resident.id)}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        利用者詳細へ戻る
                    </Link>
                </div>

                <div className="rounded-lg border bg-white p-6">
                    <p className="text-sm text-muted-foreground">
                        対象利用者
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                        {resident.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {resident.resident_code ?? '管理番号なし'} /{' '}
                        {resident.room_number ?? '-'}号室 /{' '}
                        {resident.status_label}
                    </p>
                </div>

                <div className="rounded-lg border bg-white">
                    <div className="border-b p-4">
                        <h2 className="font-semibold">タイムライン</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            最新の記録から順に表示します。
                        </p>
                    </div>

                    <div className="divide-y">
                        {timelineItems.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">
                                表示できる記録はありません。
                            </p>
                        ) : (
                            timelineItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="block p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border px-2 py-0.5 text-xs">
                                                    {item.type_label}
                                                </span>

                                                {item.is_important && (
                                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                                        重要
                                                    </span>
                                                )}

                                                {item.importance_label && (
                                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                                        {item.importance_label}
                                                    </span>
                                                )}

                                                {item.category_label && (
                                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                                        {item.category_label}
                                                    </span>
                                                )}

                                                {item.status_label && (
                                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                                        {item.status_label}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 font-medium">
                                                {item.title}
                                            </p>

                                            <p className="mt-2 line-clamp-3 text-sm">
                                                {item.content}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right text-xs text-muted-foreground">
                                            <p>{item.date}</p>
                                            <p className="mt-1">
                                                記録者：{item.staff_name}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}