export interface Paged {
    page?: number;
}

export interface Search {
    search: string;
}

export interface ById {
    id: string;
}

export type PageNumber = string;

export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    first: string;
    last: string;
    roleId: string;
    photo?: string;
}

export interface UserWithRole extends User {
    page: number;
    role: Role;
}

export interface Role {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description?: string;
    isDefault: boolean;
    page?: number;
}

export interface Page<R extends User | Role> {
    page: number;
    next: number | null;
    prev: number | null;
    pages: number;
    data: R[];
}

export type Pages<R extends User | Role> = Record<PageNumber, Page<R>>;