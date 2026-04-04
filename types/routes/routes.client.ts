import { buildRoute } from "@/helpers/route";

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


export const routes: Record<string, Record<string, (route?: Partial<BaseRoute>) => string>> = {
    "auth": {
        "login": () => buildRoute({ path: "/login" }),
        "onboarding": () => buildRoute({ path: "/onboarding" }),
    },
    "workspace": {
        "home": () => buildRoute({ path: "/workspace" }),
        "detail": (route?: Partial<BaseRoute>) => buildRoute({ path: "/workspace/:id", params: route?.params }),
        "bots": (route?: Partial<BaseRoute>) => buildRoute({ path: "/workspace/:id/bots", params: route?.params }),
    },
    "bots": {
        "home": () => buildRoute({ path: "/bots" }),
        "detail": (route?: Partial<BaseRoute>) => buildRoute({ path: "/bots/:id", params: route?.params }),
    }
}
