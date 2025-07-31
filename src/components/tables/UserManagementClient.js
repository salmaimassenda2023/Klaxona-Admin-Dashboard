"use client"
import React, {useState} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../ui/table";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa"
import { deleteUser, updateUserRole } from '../../../supabase/users'
import { formatDate } from './dateUtils'


const ROLES = ['user', 'admin', 'moderator']
export default function UserManagementClient({ users: initialUsers, currentUserId }) {
    const [users, setUsers] = useState(initialUsers)
    const [editingUser, setEditingUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleDeleteUser = async (userId) => {
        if (userId === currentUserId) {
            setMessage('You cannot delete your own account')
            return
        }

        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        setLoading(true)
        try {
            await deleteUser(userId)
            setUsers(users.filter(user => user.id !== userId))
            setMessage('User deleted successfully')
        } catch (error) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleStartEdit = (user) => {
        setEditingUser({ ...user })
    }

    const handleCancelEdit = () => {
        setEditingUser(null)
    }

    const handleSaveEdit = async () => {
        if (!editingUser) return

        setLoading(true)
        try {
            await updateUserRole(editingUser.id, editingUser.role)
            setUsers(users.map(user =>
                user.id === editingUser.id
                    ? { ...user, role: editingUser.role, user_metadata: { ...user.user_metadata, role: editingUser.role } }
                    : user
            ))
            setMessage('User role updated successfully')
            setEditingUser(null)
        } catch (error) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = (newRole) => {
        setEditingUser({ ...editingUser, role: newRole })
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    UID
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Full Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Role
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Provider
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Phone
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Created At
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Last Sign In
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {user.id}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {user.user_metadata.display_name || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-700 dark:text-blue-100">
                                        <div>
                                             {user.email}
                                            {user.id === currentUserId && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                        You
                                    </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingUser?.id === user.id ? (
                                            <select
                                                value={editingUser.role}
                                                onChange={(e) => handleRoleChange(e.target.value)}
                                                className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            >
                                                {ROLES.map(role => (
                                                    <option key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                    user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            }`}>
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                                    </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {user.app_metadata?.provider}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {user.phone || 'N/A'}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {formatDate(user.created_at)}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {formatDate(user.last_sign_in_at)}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex space-x-2">
                                            {editingUser?.id === user.id ? (
                                                <>
                                                    <button
                                                        title="Save"
                                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                        onClick={handleSaveEdit}
                                                        disabled={loading}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        title="Cancel"
                                                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                        onClick={handleCancelEdit}
                                                        disabled={loading}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        title="Edit Role"
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                        onClick={() => handleStartEdit(user)}
                                                        disabled={loading}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        title="Delete User"
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={loading || user.id === currentUserId}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {users.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No users found.</p>
            )}
        </div>
    );
}