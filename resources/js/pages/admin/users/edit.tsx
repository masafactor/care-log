import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type RoleOption = {
    value: string;
    label: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
};

type Props = {
    user: User;
    roles: RoleOption[];
};

export default function AdminUsersEdit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        is_active: user.is_active,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('admin.users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title={`職員ユーザー編集 - ${user.name}`} />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">職員ユーザー編集</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        職員アカウントの情報を編集します。
                    </p>
                </div>

                <div className="rounded-lg border bg-yellow-50 p-4 text-sm">
                    <p className="font-medium">管理者権限の変更に注意</p>
                    <p className="mt-1 text-muted-foreground">
                        自分自身や最後の有効な管理者を無効化したり、管理者権限を外すことはできません。
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium">
                            氏名
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            新しいパスワード
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="変更しない場合は空欄"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            空欄のまま更新すると、現在のパスワードは変更されません。
                        </p>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            権限
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                        />
                        <span className="text-sm font-medium">
                            有効なユーザーにする
                        </span>
                    </label>

                    {errors.is_active && (
                        <p className="text-sm text-red-600">
                            {errors.is_active}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            更新する
                        </button>

                        <Link
                            href={route('admin.users.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}