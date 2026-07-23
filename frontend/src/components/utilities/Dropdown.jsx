import { useState } from "react";
import { useAuth } from "../../hooks/UseAuth";

import classes from "./Dropdown.module.css";

import upChevIcon from "../../assets/chevron-up-icon-white.svg";
import downChevIcon from "../../assets/chevron-down-icon-white.svg";

const Dropdown = ({ options, onSelect, label }) => {
    const { user } = useAuth();

    const [isExpanded, setIsExpanded] = useState(false);

    const chooseOption = (option) => {
        onSelect(option);
        setIsExpanded(false);
    };

    return (
        <div className={`${classes.mainContainer}`}>
            <div className={classes.display} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <p>{label}</p>
            </div>
            <div className={classes.arrow} onClick={() => setIsExpanded((preVal) => !preVal)}>
                <img src={isExpanded ? upChevIcon : downChevIcon} className={classes.icon} />
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropdownContent}>
                        {options?.length > 0 &&
                            options.map((option, index) => (
                                <p onClick={() => chooseOption(option)} key={index}>
                                    {option.label}
                                </p>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
