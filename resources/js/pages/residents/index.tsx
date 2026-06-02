import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
type Resident = {
    id: number;
    name: string;
    name_kana: string | null;
    room_number: string | null;
    care_level: number | null;
    status: string;
    status_label: string;
    birth_date: string | null;
};

type Props = {
    residents: Resident[];
    filters: {
        search?: string | null;
    };
};

export default function ResidentsIndex({ residents, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('residents.index'),
            { search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clear = () => {
        setSearch('');

        router.get(
            route('residents.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="利用者一覧" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <form onSubmit={submit} className="mb-6 flex gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
                            placeholder="名前・ふりがな・居室番号で検索"
                        />

                        <button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            検索
                        </button>

                        <button
                            type="button"
                            onClick={clear}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            クリア
                        </button>
                    </form>
                    <div>
                        <h1 className="text-2xl font-bold">利用者一覧</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            施設の利用者情報を管理します。
                        </p>
                    </div>

                    <Link
                        href={route('residents.create')}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        利用者を登録
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">氏名</th>
                                <th className="px-4 py-3">居室</th>
                                <th className="px-4 py-3">介護度</th>
                                <th className="px-4 py-3">状態</th>
                                <th className="px-4 py-3">生年月日</th>
                                <th className="px-4 py-3">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        利用者が登録されていません。
                                    </td>
                                </tr>
                            ) : (
                                residents.map((resident) => (
                                    <tr key={resident.id} className="border-b">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {resident.name}
                                            </div>
                                            {resident.name_kana && (
                                                <div className="text-xs text-muted-foreground">
                                                    {resident.name_kana}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {resident.room_number ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {resident.care_level
                                                ? `要介護${resident.care_level}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                {resident.status_label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {resident.birth_date ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={route(
                                                        'residents.show',
                                                        resident.id,
                                                    )}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    詳細
                                                </Link>
                                                <Link
                                                    href={route(
                                                        'residents.edit',
                                                        resident.id,
                                                    )}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    編集
                                                </Link>
                                            </div>
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