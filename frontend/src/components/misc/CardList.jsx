import { useRef, useEffect } from "react";
import AnimeCard from "../utilities/AnimeCard";
import classes from "./CardList.module.css";

const CardList = ({ title, list }) => {
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        targetScrollRef.current = el.scrollLeft;

        const animateScroll = () => {
            const distance = targetScrollRef.current - el.scrollLeft;

            if (Math.abs(distance) < 3) {
                el.scrollLeft = targetScrollRef.current;
                animationFrameRef.current = null;
                return;
            }

            el.scrollLeft += distance * 0.18;
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        };

        const handleWheel = (e) => {
            e.preventDefault();

            const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            const speed = 1.6;
            const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);

            targetScrollRef.current = Math.min(maxLeft, Math.max(0, targetScrollRef.current + horizontalDelta * speed));

            if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", handleWheel);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className={classes.mainContainer}>
            <h2>{title}</h2>
            <div className={classes.listing} ref={scrollRef}>
                {list?.length > 0 &&
                    list.map((value, index) => (
                        <AnimeCard key={`${value.title}-${index}`} title={value.title} stars={value.stars} />
                    ))}
            </div>
        </div>
    );
};

export default CardList;
