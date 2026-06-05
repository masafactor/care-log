import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import Pagination from '@/components/pagination';
import type { PaginatedData } from '@/types/pagination';
import { currentReturnUrl } from '@/lib/return-url';


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

type RecordType = {
    value: string;
    label: string;
};

type Props = {
    records: PaginatedData<CareRecord>;
    recordTypes: RecordType[];
    filters: {
        search?: string | null;
        record_type?: string | null;
        important?: string | null;
    };
};

export default function CareRecordsIndex({
    records,
    recordTypes,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [recordType, setRecordType] = useState(filters.record_type ?? '');
    const [important, setImportant] = useState(filters.important ?? '');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('care-records.index'),
            {
                search,
                record_type: recordType,
                important,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clear = () => {
        setSearch('');
        setRecordType('');
        setImportant('');

        router.get(
            route('care-records.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };
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

                    <form onSubmit={submit} className="mb-6 grid gap-3 md:grid-cols-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm"
                            placeholder="利用者名・居室番号で検索"
                        />

                        <select
                            value={recordType}
                            onChange={(e) => setRecordType(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">すべての記録種別</option>
                            {recordTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={important}
                            onChange={(e) => setImportant(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">重要指定なし</option>
                            <option value="1">重要のみ</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                            >
                                絞り込み
                            </button>

                            <button
                                type="button"
                                onClick={clear}
                                className="rounded-md border px-4 py-2 text-sm"
                            >
                                クリア
                            </button>
                        </div>
                    </form>

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
                            {records.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        介護記録がありません。
                                    </td>
                                </tr>
                            ) : (
                                records.data.map((record) => (
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
                                             href={route('care-records.show', {
                                                    care_record: record.id,
                                                    return_url: currentReturnUrl(),
                                                })}
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
                <Pagination pagination={records} />
            </div>
        </AppLayout>
    );
}