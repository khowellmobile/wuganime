import { useState } from "react";
import { useAuth } from "../../hooks/UseAuth";

import classes from "./ProfileDropdown.module.css";

import upChevIcon from "../../assets/chevron-up-icon.svg";
import downChevIcon from "../../assets/chevron-down-icon.svg";

const ProfileDropdown = ({ val, clickTypeHandler }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuth();

    const propertyTypes = ["commercial", "residential", "multi-unit"];

    const handleClick = (type) => {
        clickTypeHandler(type);
        setIsExpanded(false);
    };

    const toggle = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div>
            <div className={`${classes.mainContainer} ${isExpanded ? classes.expandedStyle : ""}`} onClick={toggle}>
                <div className={classes.emailDiv}>
                    <p>{user?.email || user?.username || "Profile"}</p>
                </div>
                <div className={classes.divIcon}>
                    <p>{(user?.email || user?.username || "P").slice(0, 1).toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown;
