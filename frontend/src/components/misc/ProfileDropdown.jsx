import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ProfileDropdown.module.css";

import downChevron from "../../assets/chevron-down-icon-white.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import listsIcon from "../../assets/pen-icon.svg";
import statsIcon from "../../assets/light-notification-icon.svg";
import logoutIcon from "../../assets/arrow-left-icon.svg";
import { useAuth } from "../../hooks/UseAuth";

const optionList = [
    { name: "Lists", icon: listsIcon, route: "/app/lists" },
    { name: "Stats", icon: statsIcon, route: "/app/stats" },
    { name: "Settings", icon: settingsIcon, route: "/app/settings" },
    { name: "Logout", icon: logoutIcon, route: "/" },
];

const ProfileDropdown = () => {
    const navigate = useNavigate();

    const { logout, ctxUserData } = useAuth();

    const [isExpanded, setIsExpanded] = useState(false);

    const style = {
        backgroundColor: "var(--secondary-background-color)",
    };

    const handleClick = (option) => {
        if (option.name === "Logout") {
            logout();
        }

        setIsExpanded(false);
        navigate(option.route);
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.top} onClick={() => setIsExpanded((prev) => !prev)} style={isExpanded ? style : {}}>
                <div
                    className={`${classes.avatar} ${classes.avatarSm}`}
                    style={{ backgroundImage: `url(/src/assets/avatars/${ctxUserData?.avatar_key}.webp)` }}
                />

                <img src={downChevron} className={classes.dwnChev} />
            </div>
            {isExpanded && (
                <>
                    <div className={classes.anchor}>
                        <div className={classes.dropdownContent}>
                            <div className={classes.nameSection}>
                                <div
                                    className={`${classes.avatar} ${classes.avatarLg}`}
                                    style={{
                                        backgroundImage: `url(/src/assets/avatars/${ctxUserData?.avatar_key}.webp)`,
                                    }}
                                />
                                <div className={classes.name}>
                                    <h3>
                                        {ctxUserData?.username?.charAt(0).toUpperCase() +
                                            ctxUserData?.username?.slice(1) ?? ""}
                                    </h3>
                                </div>
                            </div>
                            <div className={classes.listing}>
                                {optionList.map((option, index) => (
                                    <div className={classes.option} onClick={() => handleClick(option)} key={index}>
                                        <img src={option.icon} className={classes.imgIcon} />
                                        <p>{option.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={classes.overlay} onClick={() => setIsExpanded(false)} />
                </>
            )}
        </div>
    );
};

export default ProfileDropdown;
