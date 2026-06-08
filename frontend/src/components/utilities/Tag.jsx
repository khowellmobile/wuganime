import { useState, useCallback } from "react";
import classes from "./Tag.module.css";

const getContrastColor = (hex) => {
    if (!hex) return "black";

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
};

const Tag = ({ tag }) => {
    const textColor = getContrastColor(tag?.color);

    const style = {
        backgroundColor: tag?.color,
    };

    const textStyle = {
        color: textColor,
    };

    return (
        <div className={classes.tag} style={style}>
            <p style={textStyle}>#{tag?.name.toLowerCase()}</p>
        </div>
    );
};

export default Tag;
