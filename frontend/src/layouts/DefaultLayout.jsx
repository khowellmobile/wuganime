import classes from "./DefaultLayout.module.css";
import Footer from "./layout-sections/Footer";
import Header from "./layout-sections/header";
import Menu from "./layout-sections/Menu";

/*
 *    The layout component is meant to make it easy to switch in and out pages
 *    without having to worry about positioning a header, menu, footer, etc everytime
 */
const DefaultLayout = (props) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.headerContainer}>
                <Header />
            </div>
            <div className={classes.midContainer}>
                <div className={classes.contentContainer}>{props.children}</div>
            </div>
            <div className={classes.bottomContainer}>
                <Footer />
            </div>
        </div>
    );
};

export default DefaultLayout;
