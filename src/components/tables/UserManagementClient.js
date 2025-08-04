"use client"
import React, {useState, useMemo} from "react";
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
    const [searchQuery, setSearchQuery] = useState('')

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) {
            return users
        }

        const query = searchQuery.toLowerCase().trim()

        return users.filter(user => {
            const fullName = user.user_metadata?.full_name?.toLowerCase() || ''
            const email = user.email?.toLowerCase() || ''
            const role = user.user_metadata?.user_type?.toLowerCase() || ''
            const provider = user.app_metadata?.provider?.toLowerCase() || ''
            const phone = user.user_metadata?.phone_number?.toLowerCase() || ''
            const userId = user.id?.toLowerCase() || ''

            return (
                fullName.includes(query) ||
                email.includes(query) ||
                role.includes(query) ||
                provider.includes(query) ||
                phone.includes(query) ||
                userId.includes(query)
            )
        })
    }, [users, searchQuery])

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const clearSearch = () => {
        setSearchQuery('')
    }

    return (
        <div>
            <div className="relative w-full xl:w-[420px] mb-5">
                {/* Search Icon */}
                <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                            fill=""
                        />
                    </svg>
                </span>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by name, email, role, or ID..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />

                {/* Clear/K Shortcut Button */}
                {searchQuery ? (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-2.5 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.06]"
                    >
                        <span>✕</span>
                    </button>
                ) : (
                    <button className="absolute inset-y-0 right-2.5 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                        <span>⌘</span>
                        <span>K</span>
                    </button>
                )}
            </div>

            {/* Results counter */}
            {searchQuery && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                </div>
            )}

            {/* Message display */}
            {message && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
                    {message}
                </div>
            )}

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
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {user.user_metadata?.full_name || 'N/A'}
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
                                                    value={editingUser.user_metadata?.user_type}
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
                                                    user.user_metadata?.user_type === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                        user.user_metadata?.user_type === 'moderator' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                }`}>
                                                    {user.user_metadata?.user_type?.charAt(0).toUpperCase() + user.user_metadata?.user_type?.slice(1) || 'User'}
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
                                                {user.user_metadata?.phone_number || 'N/A'}
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
                {filteredUsers.length === 0 && searchQuery && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No users found matching "{searchQuery}". Try a different search term.
                    </p>
                )}
                {filteredUsers.length === 0 && !searchQuery && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No users found.</p>
                )}
            </div>
        </div>
    );
}