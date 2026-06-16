import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

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

type Props = {
    logs: AuditLog[];
};

export default function AdminAuditLogsIndex({ logs }: Props) {
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