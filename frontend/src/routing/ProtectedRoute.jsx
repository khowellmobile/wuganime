import { useContext } from "react";
import { Navigate } from "react-router-dom";

import AuthCtx from "../contexts/AuthCtx";

function ProtectedRoute({ children }) {
    const { isAuthenticated, ctxAuthLoading } = useContext(AuthCtx);

    if (ctxAuthLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
