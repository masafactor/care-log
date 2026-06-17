import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';
type AuditLog = {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    action: string;
    target_type: string | null;
    target_id: number | null;
    ip_address: string | null;
    description: string | null;
    created_at: string;
};

type Filters = {
    search?: string | null;
    action?: string | null;
    date_from?: string | null;
    date_to?: string | null;
};

type Props = {
    logs: AuditLog[];
    actions: string[];
    filters: Filters;
};


export default function AdminAuditLogsIndex({
    logs,
    actions,
    filters,
}: Props) {

    const [search, setSearch] = useState(filters.search ?? '');
const [action, setAction] = useState(filters.action ?? '');
const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
const [dateTo, setDateTo] = useState(filters.date_to ?? '');

const submit = (e: FormEvent) => {
    e.preventDefault();

    router.get(
        route('admin.audit-logs.index'),
        {
            search,
            action,
            date_from: dateFrom,
            date_to: dateTo,
        },
        {
            preserveState: true,
            preserveScroll: true,
        },
    );
};

const clearFilters = () => {
    router.get(route('admin.audit-logs.index'));
};
    return (
        <AppLayout>
            <Head title="操作ログ" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">操作ログ</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        職員の操作履歴を確認します。
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-5"
                >
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">
                            検索
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="職員名・メール・操作内容・IP"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            操作種別
                        </label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">すべて</option>
                            {actions.map((action) => (
                                <option key={action} value={action}>
                                    {action}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            開始日
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            終了日
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="flex items-end gap-2 md:col-span-5">
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
                                <th className="px-4 py-3">日時</th>
                                <th className="px-4 py-3">職員</th>
                                <th className="px-4 py-3">操作</th>
                                <th className="px-4 py-3">内容</th>
                                <th className="px-4 py-3">IP</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {logs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        操作ログはまだありません。
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-3">
                                            {log.created_at}
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.user ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {log.user.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {log.user.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    不明
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full border px-2 py-0.5 text-xs">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.description ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.ip_address ?? '-'}
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