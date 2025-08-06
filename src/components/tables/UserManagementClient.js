"use client"
import React, {useState, useMemo} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../ui/table";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa"
import { deleteUser, updateUserRole } from '../../../supabase/users'
import { formatDate } from './dateUtils'
import { useLocale } from '../../hooks/useLocales.js' // Import the hook

// Updated ROLES array to match your database enum
const ROLES = ['CLIENT', 'DRIVER', 'DRIVER_MANAGER', 'ADMIN', 'SUPPORT']

// Remove dictionary from props since we're using the hook now
export default function UserManagementClient({ users: initialUsers, currentUserId }) {
    const [users, setUsers] = useState(initialUsers)
    const [editingUser, setEditingUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    // Use the locale hook instead of prop
    const { dictionary, isLoading: isDictionaryLoading } = useLocale()

    // Helper function to get nested dictionary values
    const t = (key) => {
        if (isDictionaryLoading || !dictionary) {
            return key // Return key if dictionary is still loading
        }

        const keys = key.split('.')
        let value = dictionary
        for (const k of keys) {
            value = value?.[k]
        }
        return value || key // Return key if translation not found
    }

    // Helper function for translations with interpolation
    const tWithParams = (key, params = {}) => {
        let translation = t(key)
        if (typeof translation === 'string') {
            // Replace {{param}} with actual values
            Object.keys(params).forEach(param => {
                const regex = new RegExp(`{{${param}}}`, 'g')
                translation = translation.replace(regex, params[param])
            })

            // Handle simple pluralization
            if (params.count !== undefined) {
                const count = params.count
                // Simple plural handling for English
                if (count === 1) {
                    translation = translation.replace(/{{count, plural, one \{\} other \{s\}}}/g, '')
                } else {
                    translation = translation.replace(/{{count, plural, one \{\} other \{s\}}}/g, 's')
                }
            }
        }
        return translation
    }

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
            setMessage(t('users.messages.cannotDeleteOwn'))
            return
        }

        if (!confirm(t('users.messages.confirmDelete'))) {
            return
        }

        setLoading(true)
        try {
            await deleteUser(userId)
            setUsers(users.filter(user => user.id !== userId))
            setMessage(t('users.messages.deleteSuccess'))
        } catch (error) {
            setMessage(tWithParams('users.messages.error', { error: error.message }))
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
                    ? { ...user, role: editingUser.role, user_metadata: { ...user.user_metadata, user_type: editingUser.role } }
                    : user
            ))
            setMessage(t('users.messages.updateSuccess'))
            setEditingUser(null)
        } catch (error) {
            setMessage(tWithParams('users.messages.error', { error: error.message }))
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

    // Updated function to handle the new role mapping
    const getRoleDisplayName = (role) => {
        if (!role) return t('users.roles.client') // Default to client

        // Convert database role to translation key
        const roleKey = role.toLowerCase().replace('_', '_') // Keep underscores for DRIVER_MANAGER
        return t(`users.roles.${roleKey}`) || role // Fallback to original role if translation not found
    }

    // Function to get role badge color
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            case 'DRIVER_MANAGER':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            case 'SUPPORT':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            case 'DRIVER':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'CLIENT':
            default:
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }
    }

    // Show loading state while dictionary is loading
    if (isDictionaryLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                    Loading translations...
                </div>
            </div>
        )
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
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />

                {/* Clear/K Shortcut Button */}
                {searchQuery ? (
                    <button
                        onClick={clearSearch}
                        title={t('search.clear')}
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
                        {tWithParams('search.resultsFound', {
                            count: filteredUsers.length,
                            query: searchQuery
                        })}
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
                                        {t('users.table.fullName')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.email')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.role')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.provider')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.phone')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.createdAt')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.lastSignIn')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        {t('users.table.actions')}
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {user.user_metadata?.full_name || t('common.notAvailable')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-700 dark:text-blue-100">
                                            <div>
                                                {user.email}
                                                {user.id === currentUserId && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                                        {t('users.you')}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {editingUser?.id === user.id ? (
                                                <select
                                                    value={editingUser.user_metadata?.user_type || editingUser.role}
                                                    onChange={(e) => handleRoleChange(e.target.value)}
                                                    className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                >
                                                    {ROLES.map(role => (
                                                        <option key={role} value={role}>
                                                            {getRoleDisplayName(role)}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(user.user_metadata?.user_type)}`}>
                                                    {getRoleDisplayName(user.user_metadata?.user_type)}
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
                                                {user.user_metadata?.phone_number || t('common.notAvailable')}
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
                                                            title={t('users.actions.save')}
                                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                            onClick={handleSaveEdit}
                                                            disabled={loading}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            title={t('users.actions.cancel')}
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
                                                            title={t('users.actions.editRole')}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                            onClick={() => handleStartEdit(user)}
                                                            disabled={loading}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            title={t('users.actions.deleteUser')}
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
                        {tWithParams('users.noResultsFound', { query: searchQuery })}
                    </p>
                )}
                {filteredUsers.length === 0 && !searchQuery && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        {t('users.noUsersFound')}
                    </p>
                )}
            </div>
        </div>
    );
}