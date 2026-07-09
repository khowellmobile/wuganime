import { useEffect, useState } from "react";
import { useModal } from "../../contexts/ModalCtx";
import AnimeModal from "../modals/AnimeModal";
import classes from "./AnimeCard.module.css";
import Tag from "../utilities/Tag";

const AnimeCard = ({ anime }) => {
    const { showModal } = useModal();
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(max-width: 768px)").matches;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleChange = (event) => setIsMobile(event.matches);

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const handleClick = () => {
        showModal(AnimeModal, { anime: anime });
    };

    const tags = anime?.tags ?? [];
    const visibleTagCount = isMobile ? 2 : 3;
    const visibleTags = tags.slice(0, visibleTagCount);
    const overflowCount = Math.max(tags.length - visibleTagCount, 0);

    return (
        <div className={classes.mainContainer} onClick={handleClick}>
            <section className={classes.pictureSection}></section>
            <section className={classes.textSection}>
                <div className={`${classes.titleDiv} ${classes.lineClamp}`}>
                    <p className={classes.title}>{anime?.title}</p>
                </div>
                <div className={classes.suppItems}>
                    <p>{anime?.stars}</p>
                    <div className={classes.tags}>
                        {visibleTags.map((tag, index) => (
                            <Tag tag={tag} key={index} />
                        ))}

                        {overflowCount > 0 && <span>+{overflowCount}</span>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnimeCard;
