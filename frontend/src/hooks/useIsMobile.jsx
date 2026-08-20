import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
    const query = `(max-width: ${breakpoint}px)`;

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(query);
        const handleChange = (event) => setIsMobile(event.matches);

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [query]);

    return isMobile;
}