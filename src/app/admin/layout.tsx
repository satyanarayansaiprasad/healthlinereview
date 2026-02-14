'use client';

import AdminSidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {!isLoginPage && <AdminSidebar />}
            <div className={isLoginPage ? "flex-1" : "flex-1 ml-64 p-8"}>
                {children}
            </div>
        </div>
    );
}
