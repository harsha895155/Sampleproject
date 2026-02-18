// This shim allows Vite to use the ReactDOM version loaded from CDN in index.html
const ReactDOM = window.ReactDOM;
export default ReactDOM;
export const { createRoot } = ReactDOM;
