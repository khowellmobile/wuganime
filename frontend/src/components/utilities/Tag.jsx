import { useState, useCallback } from "react";
import classes from "./Tag.module.css";

const Tag = ({ tag }) => {
    console.log(tag);

    return (
        <div className={`${classes.tag} ${classes[tag]}`}>
            <p>#{tag}</p>
        </div>
    );
};

export default Tag;
