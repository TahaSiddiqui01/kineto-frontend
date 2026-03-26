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


const routes: Record<string, Record<string, () => string>> = {
    "dashboard": {
        "home": () => buildRoute({ path: "/dashboard/home" }),
    }
}