import type { ById, Page, Paged, Role, Search, User } from "../types";

export async function fetchUsers({ queryKey }: { queryKey: [string, Paged & Partial<Search>] }) {
    const [, { page = 1, search }] = queryKey;

    const response = await fetch(`${apiUrl}/users?page=${page}` + (search ? `&search=${search}` : ''));
    const result = await response.json();
    if (!isPage<User>(result)) {
        throw new Error('Invalid paged users response from API');
    }
    for (const user of result.data) {
        user.createdAt = new Date(user.createdAt);
        user.updatedAt = new Date(user.updatedAt);
    }
    return result;
}

export async function fetchRoles({ queryKey }: { queryKey: [string, Paged] }) {
    const [, { page = 1 }] = queryKey;

    const response = await fetch(`${apiUrl}/roles?page=${page}`);
    const result = await response.json();
    if (!isPage<Role>(result)) {
        throw new Error('Invalid paged roles response from API');
    }
    return result;
}

export async function getRole({ queryKey }: { queryKey: [string, ById] }) {
    const [, { id }] = queryKey;

    const response = await fetch(`${apiUrl}/roles/${id}`);
    return response.json();
}

/**
 * Barebones type guard for paged data
 */
function isPage<R extends User | Role>(response: object | null): response is Page<R> {
    if (!response) {
        return false;
    }
    return 'pages' in response && 'data' in response;
}

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is not set');
}