"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { getAllUsersWithRoles } from '../../../../../../supabase/users'
import { createClient } from '../../../../../../supabase/client.js' // Use browser client for client components
import { useRouter } from 'next/navigation'
import UserManagementClient from '../../../../../components/tables/UserManagementClient'
import { useLocale } from '../../../../../hooks/useLocales.js';
import { createTranslationFunction } from '../../../../../../lib/translations.js';
import { User } from '../../../../types'

export default function BasicTables() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<Error | null>(null);
    const router = useRouter();

    // Use the locale hook
    const { dictionary, isLoading: isDictionaryLoading } = useLocale();

    // Create translation function
    const t = createTranslationFunction(dictionary, isDictionaryLoading);

    useEffect(() => {
        async function checkAuthAndLoadData() {
            try {
                setIsLoading(true);

                // Check authentication
                const supabase = createClient();
                const { data: authData, error: authError } = await supabase.auth.getUser();

                if (authError || !authData?.user) {
                    router.push('/signin');
                    return;
                }

                // Check if user is admin
                const userRole = authData.user.user_metadata?.user_type || authData.user.app_metadata?.role;

                if (userRole !== 'ADMIN') {
                    router.push('/unauthorized');
                    return;
                }

                // Set current user ID
                setCurrentUserId(authData.user.id);

                // Load users data
                const usersData = await getAllUsersWithRoles();
                setUsers(usersData);

            } catch (error) {
                console.error('Error loading data:', error);
                setAuthError(error);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthAndLoadData();
    }, [router]);

    // Show loading state while dictionary or data is loading
    if (isDictionaryLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500 dark:text-gray-400">
                    {t('common.loading')}
                </div>
            </div>
        );
    }

    // Show error state
    if (authError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    {t('users.messages.error').replace('{{error}}', authError.message)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb
                pageTitle={t('users.title')}
                dictionary={dictionary}
            />
            <div className="space-y-8">
                <UserManagementClient
                    users={users}
                    currentUserId={currentUserId}
                    dictionary={dictionary}
                />
            </div>
        </div>
    );
}