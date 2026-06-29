import { useNavigate } from "react-router-dom";

import classes from "./Menu.module.css";

const Menu = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.mainContainer}>
            <div className={classes.link} onClick={() => navigate("/app/home")}>
                <p>Home</p>
            </div>
            <div className={classes.link} onClick={() => navigate("/app/search")}>
                <p>Search</p>
            </div>
            <div className={classes.link} onClick={() => navigate("/app/lists")}>
                <p>Lists</p>
            </div>
        </div>
    );
};

export default Menu;
