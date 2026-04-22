import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";

function AuthenticatedApp() {
    const wrapPage = (PageComponent) => {
        return (
            <ProtectedRoute>
                <DefaultLayout>
                    <PageComponent />
                </DefaultLayout>
            </ProtectedRoute>
        );
    };

    return (
        <Routes>
            <Route path="/home" element={wrapPage(HomePage)} />
        </Routes>
    );
}

export default AuthenticatedApp;
