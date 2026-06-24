import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";
import ListsPage from "../pages/ListsPage";
import StatsPage from "../pages/StatsPage";
import SettingsPage from "../pages/SettingsPage";
import SearchPage from "../pages/SearchPage";

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
            <Route path="/search" element={wrapPage(SearchPage)} />
            <Route path="/lists" element={wrapPage(ListsPage)} />
            <Route path="/stats" element={wrapPage(StatsPage)} />
            <Route path="/settings" element={wrapPage(SettingsPage)} />
        </Routes>
    );
}

export default AuthenticatedApp;
