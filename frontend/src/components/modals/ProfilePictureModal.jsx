import { useRef, useEffect } from "react";

import classes from "./ProfilePictureModal.module.css";

const colors = ["white", "black", "lightgreen", "grey", "pink", "coral"];

const ProfilePictureModal = ({ closeModal }) => {
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        targetScrollRef.current = el.scrollLeft;

        let snapTimeout;

        const snapToNearestBreakpoint = () => {
            const itemWidth = el.clientWidth / 6;
            const currScrollPos = el.scrollLeft;
            const nearestIndex = Math.round(currScrollPos / itemWidth);

            targetScrollRef.current = nearestIndex * itemWidth;

            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        const animateScroll = () => {
            // Get distance between user scroll and actual element scroll
            const distance = targetScrollRef.current - el.scrollLeft;

            // If distance is small enough then snap to proper place and end recursion
            if (Math.abs(distance) < 3) {
                el.scrollLeft = targetScrollRef.current;
                animationFrameRef.current = null;
                return;
            }

            // Move element scroll 18% of the way and get next frame
            el.scrollLeft += distance * 0.18;
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

            snapTimeout = setTimeout(snapToNearestBreakpoint, 150);

            // Create new frames if no frames exist
            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });

        // Clean up on unmount
        return () => {
            el.removeEventListener("wheel", handleWheel);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className={classes.modalOverlay} onClick={closeModal}>
            <div className={classes.mainContainer} onClick={(e) => e.stopPropagation()}>
                <div className={classes.top}>
                    <div className={classes.pictureDiv}>
                        <div className={classes.icon}></div>
                    </div>
                    <div className={classes.buttonDiv}>
                        <h3>Choose Your Profile Picture</h3>
                        <p>This will be public and can be changed at any time</p>
                    </div>
                </div>
                <div className={classes.bottom}>
                    <div>
                        <p>Classic</p>
                        <div className={classes.listing} ref={scrollRef}>
                            {colors.map((color, index) => (
                                <div key={index} className={classes.pictureOption}>
                                    <div className={classes.item}></div>
                                </div>
                            ))}
                            {colors.map((color, index) => (
                                <div key={index} className={classes.pictureOption}>
                                    <div className={classes.item}></div>
                                </div>
                            ))}
                            {colors.map((color, index) => (
                                <div key={index} className={classes.pictureOption}>
                                    <div className={classes.item}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePictureModal;
