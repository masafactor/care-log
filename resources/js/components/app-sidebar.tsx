import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FileText,
    FolderGit2,
    LayoutGrid,
    MessageSquareText,
    Users,
} from 'lucide-react';
import { route } from 'ziggy-js';



type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            role_label?: string;
            is_active: boolean;
        } | null;
    };
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];



export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 'admin';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: '利用者管理', href: '/residents', icon: Users },
    { title: '介護記録', href: '/care-records', icon: FileText },
    { title: '申し送り', href: '/handovers', icon: ClipboardList },
    { title: '家族向けメモ', href: '/family-notes', icon: MessageSquareText },
    {title: '月次レポート',href: route('family-notes.report'),icon: FileText,
},
    ...(isAdmin
        ? [
              { title: '職員管理', href: route('admin.users.index'), icon: Users },
              { title: '操作ログ', href: route('admin.audit-logs.index'), icon: FileText },
          ]
        : []),
];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}