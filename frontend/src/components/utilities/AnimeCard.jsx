import classes from "./AnimeCard.module.css";
import Tag from "./Tag";

const AnimeCard = ({ title, stars }) => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.pictureSection}></section>
            <section className={classes.textSection}>
                <div className={`${classes.titleDiv} ${classes.lineClamp}`}>
                    <p className={classes.title}>{title}</p>
                </div>
                <div className={classes.suppItems}>
                    <p>{stars}</p>
                    <Tag tagName={"problem"} />
                </div>
            </section>
        </div>
    );
};

export default AnimeCard;
