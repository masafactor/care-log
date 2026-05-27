import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

type ReadUser = {
    id: number;
    user: {
        id: number;
        name: string;
    };
    read_at: string;
};

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
    reads: ReadUser[];
};

type Props = {
    note: HandoverNote;
};

export default function HandoversShow({ note }: Props) {
    const markAsRead = () => {
        router.post(route('handovers.read', note.id));
    };

    return (
        <AppLayout>
            <Head title={`申し送り詳細 - ${note.title}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">申し送り詳細</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            申し送り内容と既読状況を確認します。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={markAsRead}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            既読にする
                        </button>

                        <Link
                            href={route('handovers.index')}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            一覧へ戻る
                        </Link>
                    </div>
                </div>

                <div className="max-w-3xl rounded-lg border bg-white p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                            {note.importance_label}
                        </span>

                        {note.due_at && (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-800">
                                期限：{note.due_at}
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl font-bold">{note.title}</h2>

                    <dl className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">
                                対象利用者
                            </dt>
                            <dd className="mt-1 font-medium">
                                {note.resident ? (
                                    <>
                                        {note.resident.name}
                                        {note.resident.room_number
                                            ? `（${note.resident.room_number}）`
                                            : ''}
                                    </>
                                ) : (
                                    '全体共有'
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                作成者
                            </dt>
                            <dd className="mt-1 font-medium">
                                {note.creator.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm text-muted-foreground">
                                作成日時
                            </dt>
                            <dd className="mt-1 font-medium">
                                {note.created_at}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6 border-t pt-6">
                        <dt className="text-sm text-muted-foreground">
                            内容
                        </dt>
                        <dd className="mt-2 whitespace-pre-wrap leading-7">
                            {note.content}
                        </dd>
                    </div>
                </div>

                <div className="mt-6 max-w-3xl rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-bold">既読状況</h2>

                    {note.reads.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            まだ既読者はいません。
                        </p>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-md border">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">職員</th>
                                        <th className="px-4 py-3">既読日時</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {note.reads.map((read) => (
                                        <tr key={read.id} className="border-b">
                                            <td className="px-4 py-3">
                                                {read.user.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {read.read_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}