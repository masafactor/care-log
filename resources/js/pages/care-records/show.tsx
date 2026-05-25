import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

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
    record_type: string;
    record_type_label: string;
    content: string;
    recorded_at: string;
    is_important: boolean;
};

type Props = {
    record: CareRecord;
};

export default function CareRecordsShow({ record }: Props) {
    return (
        <AppLayout>
            <Head title={`介護記録詳細 - ${record.resident.name}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">介護記録詳細</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            記録内容を確認します。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('residents.show', record.resident.id)}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            利用者詳細へ
                        </Link>

                        <Link
                            href={route('care-records.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>

                <div className="max-w-3xl rounded-lg border bg-white p-6">
                    {record.is_important && (
                        <div className="mb-5 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                            この記録は重要フラグが付いています。
                        </div>
                    )}

                    <dl className="grid gap-5 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                利用者
                            </dt>
                            <dd className="mt-1 font-medium">
                                {record.resident.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                居室
                            </dt>
                            <dd className="mt-1 font-medium">
                                {record.resident.room_number ?? '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                記録種別
                            </dt>
                            <dd className="mt-1 font-medium">
                                {record.record_type_label}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                記録日時
                            </dt>
                            <dd className="mt-1 font-medium">
                                {record.recorded_at}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                記録者
                            </dt>
                            <dd className="mt-1 font-medium">
                                {record.staff.name}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6 border-t pt-6">
                        <dt className="text-sm text-muted-foreground">
                            記録内容
                        </dt>
                        <dd className="mt-2 whitespace-pre-wrap leading-7">
                            {record.content}
                        </dd>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}