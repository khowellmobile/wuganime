import { useState } from "react";

import classes from "./SettingsPage.module.css";

import ProfileSubpage from "./subpages/ProfileSubpage";
import AccountSubpage from "./subpages/AccountSubpage";
import Dropdown from "../components/utilities/Dropdown";
import backArrow from "../assets/arrow-left-icon.svg";
import chevDwn from "../assets/chevron-down-icon-white.svg";

const subPages = [
    { name: "Profile", desc: "Change your username, account name, or profile picture." },
    { name: "Preferences", desc: "Change display and organizational preferences." },
    { name: "Account", desc: "Change email or reset password" },
    { name: "Notifications", desc: "Change preferred contact and notification choices" },
];

const SettingsPage = () => {
    const [activeSubPage, setActiveSubPage] = useState("");

    const getActivePage = (pageName) => {
        switch (pageName) {
            case "Profile":
                return <ProfileSubpage />;
            case "Preferences":
                return <></>;
            case "Account":
                return <AccountSubpage />;
            case "Notifications":
                return <></>;
            default:
                return <></>;
        }
    };

    const getSubPage = () => {
        if (activeSubPage) {
            return getActivePage(activeSubPage);
        } else {
            return (
                <div className={classes.navListing}>
                    {subPages.map((option, index) => (
                        <div className={classes.navListingItem} onClick={() => setActiveSubPage(option.name)}>
                            <div>
                                <p>{option.name}</p>
                                <p>{option.desc}</p>
                            </div>
                            <img src={chevDwn} />
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.settings}>
                {activeSubPage && (
                    <div className={classes.backDiv} onClick={() => setActiveSubPage("")}>
                        <img src={backArrow} />
                    </div>
                )}
                {getSubPage()}
            </div>
        </div>
    );

    /* return (
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
    ); */
};

export default SettingsPage;
