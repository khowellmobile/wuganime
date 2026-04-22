import { createContext, useState, useEffect } from "react";
import { api, configureApiClient } from "../Client";

const AuthCtx = createContext({
    ctxAccessToken: null,
    ctxUserData: {},
});

export function AuthCtxProvider(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ctxUserData, setCtxUserData] = useState({});
    const [ctxAuthLoading, setCtxAuthLoading] = useState(true);

    useEffect(() => {
        configureApiClient({
            unauthorizedHandler: () => {
                setIsAuthenticated(false);
                setCtxUserData({});
            },
        });
    }, [isAuthenticated]);

    useEffect(() => {
        let isMounted = true;

        const getUserData = async () => {
            try {
                await api.post("/api/auth/refresh/", {}, { authRequired: false });
                const profile = await api.get("/api/profile/");
                if (!isMounted) {
                    return;
                }
                setCtxUserData(profile || {});
                setIsAuthenticated(true);
            } catch {
                if (isMounted) {
                    setIsAuthenticated(false);
                    setCtxUserData({});
                }
            } finally {
                if (isMounted) {
                    setCtxAuthLoading(false);
                }
            }
        };

        getUserData();

        return () => {
            isMounted = false;
        };
    }, []);

    const context = {
        isAuthenticated,
        setIsAuthenticated,
        ctxUserData,
        setCtxUserData,
        ctxAuthLoading,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
