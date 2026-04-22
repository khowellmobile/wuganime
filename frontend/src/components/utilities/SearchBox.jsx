import { useState, useEffect } from "react";

import classes from "./SearchBox.module.css";

const SearchBox = ({ type, name, value, onChange, customStyle, placeholder, isOptional = true, disabled = false }) => {
    const [warnUser, setWarnUser] = useState(false);
    const [style, setStyle] = useState(customStyle);

    const unescapeHTML = (str) => {
        if (typeof str === "string") {
            return str
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#x27;/g, "'")
                .replace(/&#x2F;/g, "/");
        } else {
            return str;
        }
    };

    return (
        <input
            type="text"
            name={name}
            className={`${classes.input} ${warnUser && classes.warn}`}
            value={unescapeHTML(value)}
            placeholder={placeholder}
            onChange={onChange}
            style={style}
            disabled={disabled}
        />
    );
};

export default SearchBox;