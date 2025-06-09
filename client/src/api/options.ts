import { queryOptions } from '@tanstack/react-query'
import { fetchRoles, fetchUsers, getRole } from './fetch';

export function listUsersOptions(page = 1) {
    return queryOptions({
        queryKey: ['users', { page }],
        queryFn: fetchUsers,
        staleTime: 5e3,
    });
}

export function searchUsersOptions(search: string, page = 1) {
    return queryOptions({
        queryKey: ['users', { search, page }],
        queryFn: fetchUsers,
        staleTime: 5e3,
    });
}

export function listRolesOptions(page = 1) {
    return queryOptions({
        queryKey: ['roles', { page }],
        queryFn: fetchRoles,
        staleTime: 5e3,
    });
}

export function getRoleOptions(id: string) {
    return queryOptions({
        queryKey: ['roles', { id }],
        queryFn: getRole,
        staleTime: 5e3,
    });
}