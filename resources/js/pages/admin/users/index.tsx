import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
    is_active: boolean;
    created_at: string;
};

type RoleOption = {
    value: string;
    label: string;
};

type Filters = {
    search?: string | null;
    role?: string | null;
    active?: string | null;
};

type Props = {
    users: User[];
    roles: RoleOption[];
    filters: Filters;
};

export default function AdminUsersIndex({ users, roles, filters }: Props) {
    
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [active, setActive] = useState(filters.active ?? '');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('admin.users.index'),
            {
                search,
                role,
                active,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        router.get(route('admin.users.index'));
    };
    
    return (
        <AppLayout>
            <Head title="職員ユーザー管理" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            職員ユーザー管理
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            職員のアカウント、権限、有効状態を管理します。
                        </p>
                    </div>

                    <Link
                        href={route('admin.users.create')}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        職員を追加
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
                            placeholder="氏名・メールアドレス"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">権限</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">すべて</option>
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">状態</label>
                        <select
                            value={active}
                            onChange={(e) => setActive(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">すべて</option>
                            <option value="1">有効</option>
                            <option value="0">無効</option>
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
                                <th className="px-4 py-3">氏名</th>
                                <th className="px-4 py-3">メールアドレス</th>
                                <th className="px-4 py-3">権限</th>
                                <th className="px-4 py-3">状態</th>
                                <th className="px-4 py-3">登録日時</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        職員ユーザーはまだ登録されていません。
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3 font-medium">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.role_label}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full border px-2 py-0.5 text-xs">
                                                {user.is_active
                                                    ? '有効'
                                                    : '無効'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.created_at}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route(
                                                    'admin.users.edit',
                                                    user.id,
                                                )}
                                                className="text-sm underline"
                                            >
                                                編集
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