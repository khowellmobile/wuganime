import classes from "./NoImageDisplay.module.css";

import icon from "../../assets/question-icon.svg";

const NoImageDisplay = () => {
    return (
        <div className={classes.mainContainer}>
            <img src={icon} />
            <p>No Image to Load</p>
        </div>
    );
};

export default NoImageDisplay;
