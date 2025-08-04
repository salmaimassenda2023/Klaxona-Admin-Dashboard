import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { getAllUsersWithRoles } from '../../../../../../supabase/users'
import { createClient } from '../../../../../../supabase/server'
import { redirect } from 'next/navigation'
import UserManagementClient from '../../../../../components/tables/UserManagementClient'

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function BasicTables() {
    // Check if current user is authenticated and is admin
    const supabase = await createClient()
    const {data: authData, error: authError} = await supabase.auth.getUser()
    console.log("info User :" ,authData.user)

    // Redirect if not authenticated
    if (authError || !authData?.user) {
        redirect('/signin')
    }

    // Get user role from user_metadata or custom claims
    const userRole = authData.user.user_metadata?.user_type || authData.user.app_metadata?.role

    // Redirect non-admin users to unauthorized page or home
    if (userRole !== 'ADMIN') {
        redirect('/unauthorized') // or redirect('/')
    }
    const users = await getAllUsersWithRoles()
    return (
        <div>
            <PageBreadcrumb pageTitle="ALL USERS"/>
            <div className="space-y-8">
                    <UserManagementClient users={users} currentUserId={authData.user.id} />

            </div>
        </div>
    );
}
