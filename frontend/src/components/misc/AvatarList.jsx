import { useEffect, useRef } from "react";
import classes from "./AvatarList.module.css";

const AvatarList = ({ avatars, title, onSelect }) => {
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        targetScrollRef.current = el.scrollLeft;

        let snapTimeout;

        const snapToNearestBreakpoint = () => {
            const firstItem = el.firstElementChild;
            const secondItem = firstItem?.nextElementSibling;
            if (!firstItem) return;

            // Calculate width of elements
            const step = secondItem
                ? secondItem.offsetLeft - firstItem.offsetLeft
                : firstItem.getBoundingClientRect().width;

            // Determine target 
            const maxScrollPosition = Math.max(0, el.scrollWidth - el.clientWidth);
            const nearestIndex = Math.round(targetScrollRef.current / step);
            targetScrollRef.current = Math.min(maxScrollPosition, Math.max(0, nearestIndex * step));

            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        const animateScroll = () => {
            const distance = targetScrollRef.current - el.scrollLeft;

            if (Math.abs(distance) <= 2) {
                el.scrollLeft = targetScrollRef.current;
                animationFrameRef.current = null;
                return;
            }

            const delta = Math.sign(distance) * Math.max(1, Math.abs(distance) * 0.09);
            el.scrollLeft += delta;
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        };

        const handleWheel = (e) => {
            e.preventDefault();

            clearTimeout(snapTimeout);

            // Calculator higher energy scroll, speed, and maxScrollPosition (upper bound of scroll)
            const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            const speed = 0.5;
            const maxScrollPosition = Math.max(0, el.scrollWidth - el.clientWidth);

            // Ensure target is not lower than scope (max) and not higher than scope (min)
            targetScrollRef.current = Math.min(
                maxScrollPosition,
                Math.max(0, targetScrollRef.current + horizontalDelta * speed),
            );

            snapTimeout = setTimeout(snapToNearestBreakpoint, 300);

            // Create new frames if no frames exist
            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });

        // Clean up on unmount
        return () => {
            el.removeEventListener("wheel", handleWheel);
            clearTimeout(snapTimeout);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div>
            <p>{title}</p>
            <div className={classes.listing} ref={scrollRef}>
                {avatars.map((avatar, index) => (
                    <div key={index} className={classes.pictureOption}>
                        <div
                            className={classes.item}
                            style={{ backgroundImage: `url(${avatar.url})` }}
                            onClick={() => onSelect(avatar)}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvatarList;
