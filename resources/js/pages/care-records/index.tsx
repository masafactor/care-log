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
    records: CareRecord[];
};

export default function CareRecordsIndex({ records }: Props) {
    return (
        <AppLayout>
            <Head title="介護記録一覧" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">介護記録一覧</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            利用者ごとの日々の介護記録を確認します。
                        </p>
                    </div>

                    <Link
                        href={route('care-records.create')}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        記録を作成
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">日時</th>
                                <th className="px-4 py-3">利用者</th>
                                <th className="px-4 py-3">種別</th>
                                <th className="px-4 py-3">内容</th>
                                <th className="px-4 py-3">記録者</th>
                                <th className="px-4 py-3">重要</th>
                                <th className="px-4 py-3">操作</th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        介護記録がありません。
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="border-b">
                                        <td className="px-4 py-3">
                                            {record.recorded_at}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {record.resident.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                居室：{record.resident.room_number ?? '-'}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {record.record_type_label}
                                            </span>
                                        </td>

                                        <td className="max-w-md px-4 py-3">
                                            <div className="line-clamp-2">
                                                {record.content}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {record.staff.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {record.is_important ? (
                                                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                                    重要
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    'care-records.show',
                                                    record.id,
                                                )}
                                                className="text-blue-600 hover:underline"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}