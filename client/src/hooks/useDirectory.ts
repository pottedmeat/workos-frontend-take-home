import { useQueries } from "@tanstack/react-query";
import { listUsersOptions, listRolesOptions, getRoleOptions, searchUsersOptions, searchRolesOptions } from "../api/options";
import type { Page, Role, UserWithRole } from "../types";
import { useMemo } from "react";

export type UseDirectoryResult = {
    userOrRole: 'user';
    isPending: boolean;
    isFetched: boolean;
    page?: Page<UserWithRole>;
} | {
    userOrRole: 'role';
    isPending: boolean;
    isFetched: boolean;
    page?: Page<Role>;
}

export type UserOrRole = 'user' | 'role';

export function useDirectory<UR extends UserOrRole>(userOrRole: UR, { pageNumber, search }: { pageNumber?: number, search?: string }): UseDirectoryResult {
    const rolePage = userOrRole === 'user' ? 1 : pageNumber;
    const userPage = userOrRole === 'user' ? pageNumber : null;
    const [
        { isPending: isRolesPending, isFetched: isRolesFetched, data: rolesPage },
        { isPending: isUsersPending, isFetched: isUsersFetched, data: usersPage } = {}
    ] = useQueries({
        queries: [
            // Load roles in either case (pre-fetching page 1 roles for users)
            search ? searchRolesOptions(search, rolePage) : listRolesOptions(rolePage),
            // Load users page if being requested
            ...(userPage !== null ? [search ? searchUsersOptions(search, pageNumber) : listUsersOptions(pageNumber)] : [])
        ] as [ReturnType<typeof listRolesOptions>, ReturnType<typeof listUsersOptions>]
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
            } as Page<UserWithRole>
        }
        return undefined;
    }, [usersPage, rolesPage, missingRoles]);

    if (userOrRole === 'user') {
        return {
            userOrRole,
            isPending: isUsersPending || isRolesPending || isMissingRolesPending,
            isFetched: Boolean(isUsersFetched) && isRolesFetched && isMissingRolesFetched,
            page: usersPageWithRoles
        };
    }
    return {
        userOrRole,
        isPending: isRolesPending,
        isFetched: isRolesFetched,
        page: rolesPage as Page<Role>
    };
}