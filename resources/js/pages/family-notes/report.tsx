import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { route } from 'ziggy-js';

type Resident = {
    id: number;
    name: string;
    resident_code: string | null;
    room_number: string | null;
};

type FamilyNote = {
    id: number;
    category_label: string;
    title: string;
    content: string;
    note_date: string;
    status_label: string;
    staff: {
        id: number;
        name: string;
    };
};

type Filters = {
    resident_id?: string | null;
    month?: string | null;
};

type Props = {
    residents: Resident[];
    selectedResident: Resident | null;
    familyNotes: FamilyNote[];
    filters: Filters;
};

export default function FamilyNotesReport({
    residents,
    selectedResident,
    familyNotes,
    filters,
}: Props) {
    const [residentId, setResidentId] = useState(filters.resident_id ?? '');
    const [month, setMonth] = useState(
        filters.month ?? new Date().toISOString().slice(0, 7),
    );

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.get(
            route('family-notes.report'),
            {
                resident_id: residentId,
                month,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const printPage = () => {
        window.print();
    };

    const markAsShared = () => {
        if (!residentId) {
            alert('利用者を選択してください。');
            return;
        }

        if (!confirm('対象月の共有可能メモを共有済みに変更しますか？')) {
            return;
        }

        router.post(
            route('family-notes.report.mark-shared'),
            {
                resident_id: residentId,
                month,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="家族向け月次レポート" />

            <div className="space-y-6 p-6">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold">
                        家族向け月次レポート
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        家族向けメモから月次報告用の文面を作成します。
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3 print:hidden"
                >
                    <div>
                        <label className="block text-sm font-medium">
                            利用者
                        </label>
                        <select
                            value={residentId}
                            onChange={(e) => setResidentId(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">選択してください</option>
                            {residents.map((resident) => (
                                <option key={resident.id} value={resident.id}>
                                    {resident.resident_code ?? '管理番号なし'} /{' '}
                                    {resident.name} /{' '}
                                    {resident.room_number ?? '-'}号室
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            対象月
                        </label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            表示
                        </button>

                        <button
                            type="button"
                            onClick={markAsShared}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            共有済みにする
                        </button>

                        <button
                            type="button"
                            onClick={printPage}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            印刷
                        </button>
                    </div>
                </form>

                <div className="rounded-lg border bg-white p-8 print:border-0 print:p-0">
                    <div className="border-b pb-4">
                        <h2 className="text-center text-2xl font-bold">
                            家族向け月次レポート
                        </h2>

                        <div className="mt-6 grid gap-2 text-sm md:grid-cols-2">
                            <p>
                                対象月：
                                <span className="font-medium">
                                    {month}
                                </span>
                            </p>

                            <p>
                                作成日：
                                <span className="font-medium">
                                    {new Date().toISOString().slice(0, 10)}
                                </span>
                            </p>

                            <p>
                                利用者：
                                <span className="font-medium">
                                    {selectedResident
                                        ? selectedResident.name
                                        : '未選択'}
                                </span>
                            </p>

                            <p>
                                管理番号：
                                <span className="font-medium">
                                    {selectedResident?.resident_code ??
                                        '管理番号なし'}
                                </span>
                            </p>

                            <p>
                                居室：
                                <span className="font-medium">
                                    {selectedResident?.room_number ?? '-'}号室
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        {!selectedResident ? (
                            <p className="text-sm text-muted-foreground">
                                利用者を選択して表示してください。
                            </p>
                        ) : familyNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                対象月の共有可能な家族向けメモはありません。
                            </p>
                        ) : (
                            familyNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="rounded-md border p-4 print:break-inside-avoid"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {note.note_date} /{' '}
                                                {note.category_label}
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold">
                                                {note.title}
                                            </h3>
                                        </div>

                                        <div className="text-right text-xs text-muted-foreground">
                                            <p>{note.status_label}</p>
                                            <p>記録者：{note.staff.name}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 whitespace-pre-wrap leading-7">
                                        {note.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}