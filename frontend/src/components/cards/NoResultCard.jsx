import { useNavigate } from "react-router-dom";

import classes from "./NoResultCard.module.css";

const NoResultCard = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.mainContainer} onClick={() => navigate("/app/home")}>
            <section className={classes.topSection}>
                <p>Nothing Here!</p>
            </section>
            <section className={classes.textSection}>
                <div className={classes.titleDiv}>
                    <p className={classes.title}>
                        Click <u>here</u> to head home
                    </p>
                </div>
                <div className={classes.suppItems}>
                    <p>Head to the home page to populate this list!</p>
                </div>
            </section>
        </div>
    );
};

export default NoResultCard;
