import { useContext } from "react";

import LibraryCtx from "../contexts/LibraryCtx";

export function useLibrary() {
    const context = useContext(LibraryCtx);

    if (!context) {
        throw new Error("useLibrary must be used within a LibraryCtxProvider");
    }

    return context;
}

export default useLibrary;
