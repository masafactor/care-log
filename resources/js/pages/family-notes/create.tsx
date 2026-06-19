import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type Option = {
    value: string;
    label: string;
};

type Resident = {
    id: number;
    name: string;
    resident_code: string | null;
    room_number: string | null;
};

type Props = {
    residents: Resident[];
    categories: Option[];
    statuses: Option[];
};

type FamilyNoteForm = {
    resident_id: string;
    category: string;
    title: string;
    content: string;
    note_date: string;
    status: string;
};

export default function FamilyNotesCreate({
    residents,
    categories,
    statuses,
}: Props) {
    const today = new Date().toISOString().slice(0, 10);

    const { data, setData, post, processing, errors } =
        useForm<FamilyNoteForm>({
            resident_id: '',
            category: categories[0]?.value ?? 'daily',
            title: '',
            content: '',
            note_date: today,
            status: statuses[0]?.value ?? 'draft',
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('family-notes.store'));
    };

    return (
        <AppLayout>
            <Head title="家族向けメモ作成" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        家族向けメモ作成
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        ご家族へ伝える近況や様子を記録します。
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-lg border bg-white p-6"
                >
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
                                <option
                                    key={resident.id}
                                    value={resident.id}
                                >
                                    {resident.resident_code ?? '管理番号なし'} /{' '}
                                    {resident.name} /{' '}
                                    {resident.room_number ?? '-'}号室
                                </option>
                            ))}
                        </select>
                        {errors.resident_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.resident_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium">
                                カテゴリ
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                メモ日付
                            </label>
                            <input
                                type="date"
                                value={data.note_date}
                                onChange={(e) =>
                                    setData('note_date', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                            {errors.note_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.note_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                状態
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            >
                                {statuses.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            タイトル
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) =>
                                setData('title', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：午前の体操に参加されました"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            内容
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) =>
                                setData('content', e.target.value)
                            }
                            className="mt-1 min-h-40 w-full rounded-md border px-3 py-2"
                            placeholder="ご家族へ伝える近況や様子を入力してください。"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            登録
                        </button>

                        <Link
                            href={route('family-notes.index')}
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