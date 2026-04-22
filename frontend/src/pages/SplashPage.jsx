import classes from "./SplashPage.module.css";

import LoginModal from "../components/modals/LoginModal";
import CreateUserModal from "../components/modals/CreateUserModal";

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const SplashPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const switchToCreateModal = () => {
        setIsModalOpen(false);
        setIsCreateModalOpen(true);
    };

    const switchToLoginModal = () => {
        setIsCreateModalOpen(false);
        setIsModalOpen(true);
    };

    if (!isLoading && isAuthenticated) {
        return <Navigate to="/app/home" replace />;
    }

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.header}>
                    <h2>
                        <strong>Application</strong> Name
                    </h2>
                </div>
                <div className={classes.content}>
                    <div className={classes.contentInfo}>
                        <h1>
                            Web App Development
                            <br /> Made Easy
                        </h1>
                        <p>
                            Take command of your online presence with this streamlined web app template. It includes a
                            frontend and backend with (most) of the default offerings (login, data storage, routing,
                            premade components, etc). It doesnt include everything you need but this template gives a
                            headstart.
                        </p>
                    </div>
                    <div className={classes.loginBox}>
                        {isModalOpen && (
                            <LoginModal handleCloseModal={handleCloseModal} switchModal={switchToCreateModal} />
                        )}
                        {isCreateModalOpen && (
                            <CreateUserModal
                                handleCloseModal={handleCloseCreateModal}
                                switchModal={switchToLoginModal}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SplashPage;
