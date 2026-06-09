import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
type StatusOption = {
    value: string;
    label: string;
};

type Props = {
    statuses: StatusOption[];
};

export default function ResidentsCreate({ statuses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        name_kana: '',
        room_number: '',
        care_level: '',
        status: 'active',
        birth_date: '',
        gender: '',
        note: '',
        resident_code: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('residents.store'));
    };

    return (
        <AppLayout>
            <Head title="利用者登録" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">利用者登録</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        新しい利用者を登録します。
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium">
                            利用者管理番号
                        </label>
                        <input
                            type="text"
                            value={data.resident_code}
                            onChange={(e) => setData('resident_code', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：R-000001"
                        />
                        {errors.resident_code && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.resident_code}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            氏名
                        </label>
                        <input
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
                            フリガナ
                        </label>
                        <input
                            value={data.name_kana}
                            onChange={(e) =>
                                setData('name_kana', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">
                                居室番号
                            </label>
                            <input
                                value={data.room_number}
                                onChange={(e) =>
                                    setData('room_number', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                介護度
                            </label>
                            <select
                                value={data.care_level}
                                onChange={(e) =>
                                    setData('care_level', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            >
                                <option value="">未設定</option>
                                <option value="1">要介護1</option>
                                <option value="2">要介護2</option>
                                <option value="3">要介護3</option>
                                <option value="4">要介護4</option>
                                <option value="5">要介護5</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                生年月日
                            </label>
                            <input
                                type="date"
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData('birth_date', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            性別
                        </label>
                        <select
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">未設定</option>
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            備考
                        </label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            rows={5}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            登録する
                        </button>

                        <Link
                            href={route('residents.index')}
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