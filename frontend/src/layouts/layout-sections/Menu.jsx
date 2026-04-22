import classes from "./Menu.module.css";

import { useAuth } from "../../hooks/UseAuth";
import { Link, useNavigate } from "react-router-dom";

import PenIcon from "../../assets/pen-icon.svg";

const Menu = () => {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/", { replace: true });
    };

    return (
        <div className={classes.mainContainer}>
            <section className={classes.itemsSection}>
                <div className={classes.menuHeader}>ANALYTICS</div>
                <MenuLineItem itemName="Link 1" link="/" icon={<img src={PenIcon} alt="Icon" />} />
                <MenuLineItem itemName="Link 2" link="/" icon={<img src={PenIcon} alt="Icon" />} />
                <MenuLineItem itemName="Link 3" link="/" icon={<img src={PenIcon} alt="Icon" />} />
                <div className={classes.menuHeader}>ACCOUNT</div>
                <MenuLineItem itemName="Special Link 1" link="/" icon={<img src={PenIcon} alt="Icon" />} />
                <div className={classes.menuHeader}>APPLICATION</div>
                <MenuLineItem itemName="Support" link="/" icon={<img src={PenIcon} alt="Icon" />} />
                <MenuLineItem itemName="Settings" link="/" icon={<img src={PenIcon} alt="Icon" />} />
            </section>
            <MenuLineItem
                className={classes.logoutItem}
                itemName="Logout"
                link="/"
                icon={<img src={PenIcon} alt="Icon" />}
                onClick={handleLogout}
            />
        </div>
    );
};

const MenuLineItem = ({ itemName, link = null, icon = null, onClick = null }) => {
    return (
        <Link to={link} className={classes.lineItemContainer} onClick={onClick}>
            <div className={classes.logoContainer}>{icon && <div className={classes.icon}>{icon}</div>}</div>
            <div className={classes.nameContainer}>
                <p>{itemName}</p>
            </div>
        </Link>
    );
};

export default Menu;
export { MenuLineItem };
