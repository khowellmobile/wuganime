import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import AuthenticatedApp from "./routing/AuthenticatedApp";
import DefaultLayout from "./layouts/DefaultLayout";

import { AuthCtxProvider } from "./contexts/AuthCtx";

function App() {
    return (
        <>
            <AuthCtxProvider>
                <Routes>
                    <Route path="/" element={<SplashPage />} />
                    <Route path="/app/*" element={<AuthenticatedApp />} />
                </Routes>
            </AuthCtxProvider>
        </>
    );
}

export default App;
