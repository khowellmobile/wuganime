import { useState } from "react";
import classes from "./SettingsPage.module.css";

const subPages = ["Profile", "Preferences", "Account", "Notifications"];

const SettingsPage = () => {
    const [activeSubPage, setActiveSubPage] = useState("Profile");

    return (
        <div className={classes.mainContainer}>
            <div className={classes.menu}>
                {subPages.map((page, index) => (
                    <div onClick={() => setActiveSubPage(page)} key={index}>
                        <h3>{page}</h3>
                    </div>
                ))}
            </div>
            <div className={classes.settings}>
                <div className={classes.top}>
                    <h2>{activeSubPage}</h2>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
