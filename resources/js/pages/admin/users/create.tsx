import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

type RoleOption = {
    value: string;
    label: string;
};

type Props = {
    roles: RoleOption[];
};

export default function AdminUsersCreate({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: roles[0]?.value ?? '',
        is_active: true,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('admin.users.store'));
    };

    return (
        <AppLayout>
            <Head title="職員ユーザー追加" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">職員ユーザー追加</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        新しい職員アカウントを作成します。
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
                            パスワード
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
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
                            有効なユーザーとして登録する
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
                            登録する
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