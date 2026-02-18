import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext(null);

export const BrowserRouter = ({ children }) => {
    const [pathname, setPathname] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => setPathname(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const value = { pathname, setPathname };

    return (
        <RouterContext.Provider value={value}>
            {children}
        </RouterContext.Provider>
    );
};

export const Routes = ({ children }) => {
    const context = useContext(RouterContext);
    if (!context) return null;
    
    const { pathname } = context;
    const childrenArray = React.Children.toArray(children);
    
    // Find the matching route
    const match = childrenArray.find(child => {
        const { path } = child.props;
        if (!path) return true; // Layout/Wrapper routes often don't have paths
        if (path === pathname) return true;
        return false;
    });

    return match ? React.cloneElement(match, { currentPath: pathname }) : <div>404 - Not Found</div>;
};

const OutletContext = createContext(null);

export const Route = ({ element, children, currentPath }) => {
    const parentContext = useContext(RouterContext);
    
    const renderChildren = () => {
        const childrenArray = React.Children.toArray(children);
        const match = childrenArray.find(c => c.props.path === currentPath);
        return match || null;
    };

    return (
        <OutletContext.Provider value={renderChildren()}>
            {/* We must keep the RouterContext available for nested Links */}
            <RouterContext.Provider value={parentContext}>
                {element || children}
            </RouterContext.Provider>
        </OutletContext.Provider>
    );
};

export const Outlet = () => {
    const outlet = useContext(OutletContext);
    return outlet || null;
};

export const Link = ({ to, children, ...props }) => {
    const context = useContext(RouterContext);
    const handleClick = (e) => {
        e.preventDefault();
        window.history.pushState({}, '', to);
        if (context) context.setPathname(to);
    };
    return <a href={to} {...props} onClick={handleClick}>{children}</a>;
};

export const useNavigate = () => {
    const context = useContext(RouterContext);
    return (to) => {
        window.history.pushState({}, '', to);
        if (context) context.setPathname(to);
    };
};

export const useLocation = () => {
    const context = useContext(RouterContext);
    return { pathname: context ? context.pathname : '/' };
};

export const useParams = () => ({});

export const Navigate = ({ to }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    }, [to, navigate]);
    return null;
};

export default {
    BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams, Navigate, Outlet
};
