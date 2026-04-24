import { useModal } from "../../contexts/ModalCtx";
import AnimeModal from "../modals/AnimeModal";
import classes from "./AnimeCard.module.css";
import Tag from "./Tag";

const AnimeCard = ({ title, stars, tags }) => {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(AnimeModal, { title: "Example Modal", stars: "" });
    };

    return (
        <div className={classes.mainContainer} onClick={handleClick}>
            <section className={classes.pictureSection}></section>
            <section className={classes.textSection}>
                <div className={`${classes.titleDiv} ${classes.lineClamp}`}>
                    <p className={classes.title}>{title}</p>
                </div>
                <div className={classes.suppItems}>
                    <p>{stars}</p>
                    <div className={classes.tags}>
                        {tags?.length > 0 && tags.map((tag, index) => <Tag tagName={tag} key={index} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnimeCard;
