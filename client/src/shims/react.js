// This shim allows Vite to use the React version loaded from CDN in index.html
const React = window.React;
export default React;
export const { 
    createContext, 
    useState, 
    useEffect, 
    useContext, 
    useMemo, 
    useCallback, 
    useRef, 
    useReducer, 
    useLayoutEffect, 
    StrictMode,
    Fragment
} = React;
