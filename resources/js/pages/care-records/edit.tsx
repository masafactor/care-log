import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type CareRecord = {
    id: number;
    resident: {
        id: number;
        resident_code: string | null;
        name: string;
        room_number: string | null;
    };
    record_type: string;
    content: string;
    recorded_at: string;
    is_important: boolean;
};

type RecordType = {
    value: string;
    label: string;
};

type Props = {
    record: CareRecord;
    recordTypes: RecordType[];
};

export default function CareRecordsEdit({ record, recordTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        record_type: record.record_type,
        content: record.content,
        recorded_at: record.recorded_at,
        is_important: record.is_important,
        reason: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('care-records.update', record.id));
    };

    return (
        <AppLayout>
            <Head title={`介護記録修正 - ${record.resident.name}`} />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">介護記録修正</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        介護記録を修正します。修正理由は必須です。
                    </p>
                </div>

                <div className="mb-6 rounded-lg border bg-white p-4">
                    <p className="mt-1 font-medium">
                        {record.resident.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {record.resident.resident_code ?? '管理番号なし'} /{' '}
                        {record.resident.room_number ?? '-'}号室
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">
                                記録種別
                            </label>
                                <select
                                    value={data.record_type}
                                    onChange={(e) => setData('record_type', e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                >
                                    {recordTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            {errors.record_type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.record_type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                記録日時
                            </label>
                            <input
                                type="datetime-local"
                                value={data.recorded_at}
                                onChange={(e) =>
                                    setData('recorded_at', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                            {errors.recorded_at && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.recorded_at}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            記録内容
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={8}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.is_important}
                            onChange={(e) =>
                                setData('is_important', e.target.checked)
                            }
                        />
                        <span className="text-sm font-medium">
                            重要な記録として扱う
                        </span>
                    </label>

                    <div>
                        <label className="block text-sm font-medium">
                            修正理由
                        </label>
                        <textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：記録内容に誤記があったため修正。"
                        />
                        {errors.reason && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            修正する
                        </button>

                        <Link
                            href={route('care-records.show', record.id)}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            詳細へ戻る
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}   