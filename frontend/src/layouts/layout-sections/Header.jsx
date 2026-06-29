import classes from "./Header.module.css";

import DashIcon from "../../assets/dash-icon.svg";
import SearchBox from "../../components/utilities/SearchBox";
import Dropdown from "../../components/utilities/Dropdown";
import ProfileDropdown from "../../components/misc/ProfileDropdown";
import Menu from "../../components/misc/Menu";

const Header = () => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.left}>
                <div className={classes.icon}>
                    <img src={DashIcon} alt="Icon" />
                </div>
                <p>
                    <strong>React</strong>App
                </p>
            </div>
            <div className={classes.middle}>
                <Menu />
            </div>
            <div className={classes.right}>
                <ProfileDropdown />
            </div>
        </div>
    );
};

export default Header;
