import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminIndex() {
    return (
        <AppLayout>
            <Head title="管理画面" />

            <div className="p-6">
                <h1 className="text-2xl font-bold">管理画面</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    管理者のみアクセスできます。
                </p>
            </div>
        </AppLayout>
    );
}