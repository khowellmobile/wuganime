import { createContext, useContext, useState, useCallback } from "react";

const ModalCtx = createContext(null);

export const ModalCtxProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isVisible: false,
        content: null,
        props: {},
    });

    const showModal = useCallback((Component, props = {}) => {
        setModal({
            isVisible: true,
            content: Component,
            props: props,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal({
            isVisible: false,
            content: null,
            props: {},
        });
    }, []);

    const contextValue = { showModal, closeModal };

    const ActiveModal = modal.content;

    return (
        <ModalCtx.Provider value={contextValue}>
            {children}
            {modal.isVisible && ActiveModal && <ActiveModal {...ModalCtx.props} closeModal={closeModal} />}
        </ModalCtx.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalCtx);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
