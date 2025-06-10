const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is not set');
}

export function deleteUser(id: string) {
    return fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
    });
}

export function renameRole(id: string, name: string) {
    return fetch(`${apiUrl}/roles/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
}