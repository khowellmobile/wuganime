import { useState, useCallback } from "react";
import classes from "./Tag.module.css";

const Tag = ({ tagName }) => {
    return (
        <div className={`${classes.tag} ${classes[tagName]}`}>
            <p>#{tagName}</p>
        </div>
    );
};

export default Tag;
