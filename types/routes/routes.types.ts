import { buildRoute } from "@/helpers/auth";

export interface BaseRoute {
    path: string;
    queryParams?: Record<string, string>; // Optional query parameters for the route
    params?: Record<string, string>; // path parameters for the route
}

export interface ClientRout extends BaseRoute {
    name: string;
    identifier: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
}


export const routes: Record<string, Record<string, () => string>> = {
    "workspace": {
        "home": () => buildRoute({ path: "/workspace/home" }),
    }
}