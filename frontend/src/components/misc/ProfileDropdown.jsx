import { useState } from "react";

import classes from "./ProfileDropdown.module.css";

import downChevron from "../../assets/chevron-down-icon-white.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import listsIcon from "../../assets/pen-icon.svg";
import statsIcon from "../../assets/light-notification-icon.svg";
import logoutIcon from "../../assets/arrow-left-icon.svg";

const optionList = [
    { name: "Lists", icon: listsIcon },
    { name: "Stats", icon: statsIcon },
    { name: "Settings", icon: settingsIcon },
    { name: "Logout", icon: logoutIcon },
];

const ProfileDropdown = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const style = {
        backgroundColor: "var(--secondary-background-color)",
    };

    return (
        <div className={classes.mainContainer} style={isExpanded ? style : {}}>
            <div className={classes.top} onClick={() => setIsExpanded((prev) => !prev)}>
                <div className={classes.iconSm}></div>
                <img src={downChevron} className={classes.dwnChev} />
            </div>
            {isExpanded && (
                <div className={classes.anchor}>
                    <div className={classes.dropdownContent}>
                        <div className={classes.nameSection}>
                            <div className={classes.iconLg}></div>
                            <div className={classes.name}>
                                <h3>WugWug</h3>
                            </div>
                        </div>
                        <div className={classes.listing}>
                            {optionList.map((opt) => (
                                <div className={classes.option}>
                                    <img src={opt.icon} className={classes.imgIcon}/>
                                    <p>{opt.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
