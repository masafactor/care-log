import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type Resident = {
    id: number;
    name: string;
    room_number: string | null;
};

type ImportanceOption = {
    value: string;
    label: string;
};

type Props = {
    residents: Resident[];
    importanceOptions: ImportanceOption[];
    selectedResidentId?: string | null;
};

export default function HandoversCreate({
    residents,
    importanceOptions,
    selectedResidentId,
}: Props)  {
    const { data, setData, post, processing, errors } = useForm({
    resident_id: selectedResidentId ?? '',
    title: '',
    content: '',
    importance: 'normal',
    due_at: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('handovers.store'));
    };

    return (
        <AppLayout>
            <Head title="申し送り作成" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">申し送り作成</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        職員間で共有する申し送り事項を作成します。
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium">
                            対象利用者
                        </label>
                        <select
                            value={data.resident_id}
                            onChange={(e) =>
                                setData('resident_id', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">全体共有</option>
                            {residents.map((resident) => (
                                <option key={resident.id} value={resident.id}>
                                    {resident.name}
                                    {resident.room_number
                                        ? `（${resident.room_number}）`
                                        : ''}
                                </option>
                            ))}
                        </select>
                        {errors.resident_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.resident_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            タイトル
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：夜勤帯への申し送り"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">
                                重要度
                            </label>
                            <select
                                value={data.importance}
                                onChange={(e) =>
                                    setData('importance', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            >
                                {importanceOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.importance && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.importance}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                確認期限
                            </label>
                            <input
                                type="datetime-local"
                                value={data.due_at}
                                onChange={(e) =>
                                    setData('due_at', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                            {errors.due_at && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.due_at}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            内容
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={8}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：本日、夕食後に少し咳込みがありました。夜間の様子確認をお願いします。"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            作成する
                        </button>

                        <Link
                            href={route('handovers.index')}
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