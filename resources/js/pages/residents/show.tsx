import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
type Resident = {
    id: number;
    name: string;
    name_kana: string | null;
    room_number: string | null;
    care_level: number | null;
    status: string;
    status_label: string;
    birth_date: string | null;
    gender: string | null;
    note: string | null;
};

type Props = {
    resident: Resident;
};

function genderLabel(gender: string | null) {
    if (gender === 'male') return '男性';
    if (gender === 'female') return '女性';
    if (gender === 'other') return 'その他';
    return '未設定';
}

export default function ResidentsShow({ resident }: Props) {
    return (
        <AppLayout>
            <Head title={`利用者詳細 - ${resident.name}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{resident.name}</h1>
                        {resident.name_kana && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {resident.name_kana}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('residents.edit', resident.id)}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            編集
                        </Link>
                        <Link
                            href={route('residents.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>

                <div className="max-w-3xl rounded-lg border bg-white p-6">
                    <dl className="grid gap-5 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                居室番号
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.room_number ?? '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                介護度
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.care_level
                                    ? `要介護${resident.care_level}`
                                    : '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                状態
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.status_label}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                生年月日
                            </dt>
                            <dd className="mt-1 font-medium">
                                {resident.birth_date ?? '-'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                性別
                            </dt>
                            <dd className="mt-1 font-medium">
                                {genderLabel(resident.gender)}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6 border-t pt-6">
                        <dt className="text-sm text-muted-foreground">備考</dt>
                        <dd className="mt-2 whitespace-pre-wrap">
                            {resident.note || '備考はありません。'}
                        </dd>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}