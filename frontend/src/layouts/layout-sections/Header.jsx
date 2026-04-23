import classes from "./Header.module.css";

import DashIcon from "../../assets/dash-icon.svg";
import SearchBox from "../../components/utilities/SearchBox";
import ProfileDropdown from "../../components/utilities/ProfileDropdown";

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
                <SearchBox type="text" name="search" value={""} placeholder={"Search"} />
            </div>
            <div className={classes.right}>
                <ProfileDropdown />
            </div>
        </div>
    );
};

export default Header;
