import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import AuthenticatedApp from "./routing/AuthenticatedApp";
import DefaultLayout from "./layouts/DefaultLayout";

import { AuthCtxProvider } from "./contexts/AuthCtx";
import { ModalCtxProvider } from "./contexts/ModalCtx";
import { LibraryCtxProvider } from "./contexts/LibraryCtx";

function App() {
    return (
        <>
            <AuthCtxProvider>
                <LibraryCtxProvider>
                    <ModalCtxProvider>
                        <Routes>
                            <Route path="/" element={<SplashPage />} />
                            <Route path="/app/*" element={<AuthenticatedApp />} />
                        </Routes>
                    </ModalCtxProvider>
                </LibraryCtxProvider>
            </AuthCtxProvider>
        </>
    );
}

export default App;
