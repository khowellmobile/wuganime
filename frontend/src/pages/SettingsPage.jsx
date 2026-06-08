import { useState } from "react";
import classes from "./SettingsPage.module.css";
import ProfileSubpage from "./subpages/ProfileSubpage";
import AccountSubpage from "./subpages/AccountSubpage";

const subPages = ["Profile", "Preferences", "Account", "Notifications"];

const SettingsPage = () => {
    const [activeSubPage, setActiveSubPage] = useState("Profile");

    const getActivePage = (pageName) => {
        switch (pageName) {
            case "Profile":
                return <ProfileSubpage />;
            case "Preferences":
                return <></>;
            case "Account":
                return <AccountSubpage/>;
            case "Notifications":
                return <></>;
            default:
                return <></>;
        }
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.menu}>
                {subPages.map((page, index) => (
                    <div onClick={() => setActiveSubPage(page)} key={index}>
                        <h3>{page}</h3>
                    </div>
                ))}
            </div>
            <div className={classes.settings}>{getActivePage(activeSubPage)}</div>
        </div>
    );
};

export default SettingsPage;
