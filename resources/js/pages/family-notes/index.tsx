import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';
import type { PaginatedData } from '@/types/pagination';

type Option = {
    value: string;
    label: string;
};

type FamilyNote = {
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
    category: string;
    category_label: string;
    title: string;
    note_date: string;
    status: string;
    status_label: string;
    created_at: string;
};



type Filters = {
    search?: string | null;
    category?: string | null;
    status?: string | null;
};

type Props = {
    familyNotes: PaginatedData<FamilyNote>;
    categories: Option[];
    statuses: Option[];
    filters: Filters;
};

export default function FamilyNotesIndex({
    familyNotes,
    categories,
    statuses,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('family-notes.index'),
            {
                search,
                category,
                status,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        router.get(route('family-notes.index'));
    };

    return (
        <AppLayout>
            <Head title="家族向けメモ" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">家族向けメモ</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            ご家族へ伝える近況や様子を記録します。
                        </p>
                    </div>

                    <Link
                        href={route('family-notes.create')}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        メモを作成
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4"
                >
                    <div>
                        <label className="block text-sm font-medium">検索</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="利用者名・管理番号・タイトル"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">カテゴリ</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">すべて</option>
                            {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">状態</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">すべて</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            検索
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            クリア
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">日付</th>
                                <th className="px-4 py-3">利用者</th>
                                <th className="px-4 py-3">カテゴリ</th>
                                <th className="px-4 py-3">タイトル</th>
                                <th className="px-4 py-3">状態</th>
                                <th className="px-4 py-3">記録者</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {familyNotes.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        条件に一致する家族向けメモはありません。
                                    </td>
                                </tr>
                            ) : (
                                familyNotes.data.map((note) => (
                                    <tr key={note.id}>
                                        <td className="px-4 py-3">
                                            {note.note_date}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {note.resident.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {note.resident.resident_code ?? '管理番号なし'} /{' '}
                                                {note.resident.room_number ?? '-'}号室
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.category_label}
                                        </td>

                                        <td className="px-4 py-3 font-medium">
                                            {note.title}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="rounded-full border px-2 py-0.5 text-xs">
                                                {note.status_label}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.staff.name}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route('family-notes.show', note.id)}
                                                className="text-sm underline"
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

                <Pagination pagination={familyNotes} />
            </div>
        </AppLayout>
    );
}