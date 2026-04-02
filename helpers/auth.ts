import { BaseRoute } from "@/types/routes/routes.types";

export function buildRoute(route: BaseRoute): string {
    const { path, queryParams, params } = route;
    let queryString = '';
    let pathWithParams = path;

    if (queryParams) {
        queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    if (params) {
        Object.entries(params).map(([key, value]) => {
            pathWithParams = path.replace(`:${key}`, encodeURIComponent(value));
        });
    }
    return `${pathWithParams}?${queryString}`;
}