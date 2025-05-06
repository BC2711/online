export interface Links {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}
export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}
export type SortDirection = 'asc' | 'desc';