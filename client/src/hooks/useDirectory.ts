import { useQueries } from "@tanstack/react-query";
import { listUsersOptions, listRolesOptions, getRoleOptions, searchUsersOptions } from "../api/options";
import type { Page, Role, UserWithRole } from "../types";
import { useMemo } from "react";

export type UseDirectoryResult = {
    isPending: boolean;
    isFetched: boolean;
    page?: Page<UserWithRole>;
};

export function useDirectory({ pageNumber, search }: { pageNumber?: number; search?: string }): UseDirectoryResult {
    const [
        { isPending: isRolesPending, isFetched: isRolesFetched, data: rolesPage },
        { isPending: isUsersPending, isFetched: isUsersFetched, data: usersPage } = {}
    ] = useQueries({
        queries: [
            listRolesOptions(1),
            search ? searchUsersOptions(search, pageNumber) : listUsersOptions(pageNumber)
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
                    page: pageNumber,
                    role: rolesPage!.data.find((role) => role.id === user.roleId)
                }))
            } as Page<UserWithRole>
        }
        return undefined;
    }, [usersPage, rolesPage, missingRoles]);
    
    return {
        isPending: isUsersPending || isRolesPending || isMissingRolesPending,
        isFetched: Boolean(isUsersFetched) && isRolesFetched && isMissingRolesFetched,
        page: usersPageWithRoles,
    };
}