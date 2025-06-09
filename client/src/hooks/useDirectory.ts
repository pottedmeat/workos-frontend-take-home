import { useQueries } from "@tanstack/react-query";
import { listUsersOptions, listRolesOptions, getRoleOptions } from "../api/options";
import type { Page, Role, User } from "../types";
import { useMemo } from "react";

export function useDirectory(userOrRole: 'user', page?: number): Page<User>;
export function useDirectory(userOrRole: 'role', page?: number): Page<Role>;
export function useDirectory(userOrRole: 'user' | 'role', page = 1): Page<User> | Page<Role> {
    const rolePage = userOrRole === 'user' ? 1 : page;
    const userPage = userOrRole === 'user' ? page : null;
    const [
        { isPending: isRolesPending, isFetched: isRolesFetched, data: rolesPage },
        { isPending: isUsersPending, isFetched: isUsersFetched, data: usersPage } = {}
    ] = useQueries({
        queries: [
            // Load roles in either case (pre-fetching page 1 roles for users)
            listRolesOptions(rolePage),
            // Load users page if being requested
            ...(userPage !== null ? [listUsersOptions(page)] : [])
        ]
    });

    // Fetch any role IDs not found on the first user page (if requested)
    const missingRoleIds: string[] = [];
    if (isRolesFetched && isUsersFetched) {
        for (const user of usersPage!.data) {
            if (!rolesPage!.data.some((role) => role.id === user.roleId)) {
                missingRoleIds.push(user.roleId);
            }
        }
    }
    const { isPending: isMissingRolesPending, isFetched: isMissingRolesFetched, data: missingRoles } = useQueries({
        queries: missingRoleIds.map(getRoleOptions),
        combine: (results) => ({
            data: results.map((result) => result.data as Role),
            isPending: results.some((result) => result.isPending),
            isFetched: results.every((result) => result.isFetched),
        })
    });

    // Assign roles to users
    const usersPageWithRoles = useMemo(() => {
        if (isRolesFetched && isUsersFetched) {
            return {
                ...usersPage,
                data: usersPage!.data.map((user) => ({
                    ...user,
                    role: rolesPage!.data.find((role) => role.id === user.roleId)
                }))
            } as Page<User>
        }
        return {} as Page<User>;
    }, [usersPage, rolesPage, missingRoles]);

    if (userOrRole === 'user') {
        return usersPageWithRoles;
    }
    return rolesPage!;
}