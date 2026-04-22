import { useContext } from "react";
import { BASE_URL } from "../constants";
import AuthCtx from "../contexts/AuthCtx";
import { api } from "../Client";

export function useAuth() {
    const { setIsAuthenticated, setCtxUserData } = useContext(AuthCtx);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.detail || "Login failed please try again.";
                return { success: false, message: errorMessage };
            }

            setIsAuthenticated(true);
            await getUser();
            return { success: true, message: "Login successful." };
        } catch (error) {
            return { success: false, message: "A network error occurred. Please try again." };
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout/", {});
        } catch {
            // Even if logout endpoint fails, clear client auth state.
        }
        setIsAuthenticated(false);
        setCtxUserData({});
    };

    const getUser = async () => {
        try {
            const returnedProfile = await api.get("/api/profile/");
            setCtxUserData(returnedProfile);
            setIsAuthenticated(true);
            return { success: true, data: returnedProfile };
        } catch (e) {
            setIsAuthenticated(false);
            setCtxUserData({});
            return { success: false, error: e?.message || "Unable to fetch user profile." };
        }
    };

    return {
        login,
        logout,
        getUser,
    };
}
