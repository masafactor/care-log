import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type Resident = {
    id: number;
    resident_code: string | null;
    name: string;
    room_number: string | null;
};

type RecordType = {
    value: string;
    label: string;
};


type Props = {
    residents: Resident[];
    recordTypes: RecordType[];
    selectedResidentId?: string | null;
};



export default function CareRecordsCreate({ residents,recordTypes,selectedResidentId,}: Props) {
    const now = new Date();
    const defaultRecordedAt = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000,
    )
        .toISOString()
        .slice(0, 16);

   const { data, setData, post, processing, errors } = useForm({
    resident_id: selectedResidentId ?? '',
    record_type: 'condition',
    content: '',
    recorded_at: defaultRecordedAt,
    is_important: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('care-records.store'));
    };

    return (
        <AppLayout>
            <Head title="介護記録作成" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">介護記録作成</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        利用者の日々の様子やケア内容を記録します。
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium">
                            利用者
                        </label>
                        <select
                            value={data.resident_id}
                            onChange={(e) =>
                                setData('resident_id', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">選択してください</option>
                            {residents.map((resident) => (
                                <option key={resident.id} value={resident.id}>
                                    {resident.resident_code ?? '管理番号なし'} / {resident.name} / {resident.room_number}号室
                                </option>
                            ))}
                        </select>
                        {errors.resident_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.resident_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">
                                記録種別
                            </label>
                            <select
                                value={data.record_type}
                                onChange={(e) =>
                                    setData('record_type', e.target.value)
                                }
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
                            placeholder="例：昼食は全量摂取。午後は穏やかに過ごされていた。"
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

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            記録する
                        </button>

                        <Link
                            href={route('care-records.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            戻る
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}