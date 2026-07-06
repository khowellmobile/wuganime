import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

import searchIcon from "../../assets/light-notification-icon.svg";
import DashIcon from "../../assets/dash-icon.svg";
import SearchBox from "../../components/utilities/SearchBox";
import Dropdown from "../../components/utilities/Dropdown";
import HeaderDropdown from "../../components/misc/HeaderDropdown";
import Menu from "../../components/misc/Menu";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.mainContainer}>
            <div className={classes.left} >
                <div className={classes.icon} onClick={() => navigate("/app/home")}>
                    <img src={DashIcon} alt="Icon" />
                </div>
                <p onClick={() => navigate("/app/home")}>
                    <strong>React</strong>App
                </p>
            </div>
            <div className={classes.middle}>
                <Menu />
            </div>
            <div className={classes.right}>
                <img src={searchIcon} className={classes.searchIcon} onClick={() => navigate("/app/search")}/>
                <HeaderDropdown />
            </div>
        </div>
    );
};

export default Header;
