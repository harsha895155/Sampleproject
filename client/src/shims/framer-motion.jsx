import React from 'react';

export const motion = new Proxy({}, {
    get: (target, prop) => {
        return ({ children, ...props }) => {
            const { initial, animate, exit, transition, variants, ...cleanProps } = props;
            return React.createElement(prop, cleanProps, children);
        };
    }
});

export const AnimatePresence = ({ children }) => <>{children}</>;

export default { motion, AnimatePresence };
