import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type HandoverNote = {
    id: number;
    resident: {
        id: number;
        name: string;
        room_number: string | null;
    } | null;
    creator: {
        id: number;
        name: string;
    };
    title: string;
    content: string;
    importance: string;
    importance_label: string;
    due_at: string | null;
    created_at: string;
    is_read: boolean;
    read_count: number;
    status: string;
    status_label: string;
    completed_at: string | null;
};

type Option = {
    value: string;
    label: string;
};

type Props = {
    notes: HandoverNote[];
    importanceOptions: Option[];
    statusOptions: Option[];
    filters: {
        search?: string | null;
        importance?: string | null;
        status?: string | null;
    };
};

export default function HandoversIndex({
    notes,
    importanceOptions,
    statusOptions,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [importance, setImportance] = useState(filters.importance ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('handovers.index'),
            {
                search,
                importance,
                status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clear = () => {
        setSearch('');
        setImportance('');
        setStatus('');

        router.get(
            route('handovers.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };
    return (
        <AppLayout>
            <Head title="申し送り一覧" />

            <div className="p-6">
                <form onSubmit={submit} className="mb-6 grid gap-3 md:grid-cols-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm"
                        placeholder="タイトル・内容・利用者名で検索"
                    />

                    <select
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">すべての重要度</option>
                        {importanceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">すべてのステータス</option>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
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
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">申し送り一覧</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            職員間で共有する申し送り事項を確認します。
                        </p>
                    </div>

                    <Link
                        href={route('handovers.create')}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        申し送りを作成
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">状態</th>
                                <th className="px-4 py-3">重要度</th>
                                <th className="px-4 py-3">タイトル</th>
                                <th className="px-4 py-3">ステータス</th>
                                <th className="px-4 py-3">利用者</th>
                                <th className="px-4 py-3">作成者</th>
                                <th className="px-4 py-3">期限</th>
                                <th className="px-4 py-3">既読数</th>
                                <th className="px-4 py-3">操作</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        申し送りはありません。
                                    </td>
                                </tr>
                            ) : (
                                notes.map((note) => (
                                    <tr key={note.id} className="border-b">
                                        <td className="px-4 py-3">
                                            {note.is_read ? (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                    既読
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                    未読
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {note.importance_label}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {note.title}
                                            </div>
                                            <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                {note.content}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {note.status_label}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.resident ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {note.resident.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        居室：
                                                        {note.resident
                                                            .room_number ?? '-'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    全体共有
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.creator.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.due_at ?? '-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            {note.read_count}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    'handovers.show',
                                                    note.id,
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