"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const { isLoading, user } = useAuth({
        redirectTo: "/signin",
        requireAuth: true,
        requireAdmin: false,
    });

    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Si le chargement est en cours, affichez un spinner ou un message
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Si l'utilisateur n'est pas authentifié (après le chargement), rien n'est affiché ici car le hook se charge de la redirection
    // Si le hook ne redirige pas pour une raison quelconque et que user est null, vous pouvez ajouter une vérification
    if (!user) {
        return null;
    }

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar and Backdrop */}
            <AppSidebar />
            <Backdrop />
            {/* Main Content Area */}
            <div
                className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
                {/* Header */}
                <AppHeader />
                {/* Page Content */}
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
            </div>
        </div>
    );
}