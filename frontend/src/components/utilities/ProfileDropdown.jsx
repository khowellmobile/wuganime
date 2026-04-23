import { useState } from "react";
import { useAuth } from "../../hooks/UseAuth";

import classes from "./ProfileDropdown.module.css";

import upChevIcon from "../../assets/chevron-up-icon.svg";
import downChevIcon from "../../assets/chevron-down-icon.svg";

const ProfileDropdown = ({}) => {
    const { user } = useAuth();

    return (
        <div>
            <div className={`${classes.mainContainer}`}>
                <div className={classes.divIcon}>
                    <p>P</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown;
