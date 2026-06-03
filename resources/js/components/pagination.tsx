import { Link } from '@inertiajs/react';
import type { PaginatedData } from '@/types/pagination';

type Props<T> = {
    pagination: PaginatedData<T>;
};

export default function Pagination<T>({ pagination }: Props<T>) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
                {pagination.total}件中 {pagination.from ?? 0}〜
                {pagination.to ?? 0}件を表示
            </div>

            <div className="flex flex-wrap gap-2">
                {pagination.links.map((link, index) => {
                    const label = link.label
                        .replace('&laquo; Previous', '前へ')
                        .replace('Next &raquo;', '次へ');

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="rounded-md border px-3 py-1 text-sm text-muted-foreground opacity-50"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={
                                link.active
                                    ? 'rounded-md bg-black px-3 py-1 text-sm text-white'
                                    : 'rounded-md border px-3 py-1 text-sm hover:bg-gray-50'
                            }
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}