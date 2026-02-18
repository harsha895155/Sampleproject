import React from 'react';

const DummyComponent = ({ children, ...props }) => {
    // If it's a component that expects function children (like ResponsiveContainer sometimes)
    if (typeof children === 'function') {
        return children({ width: 800, height: 400 });
    }
    return <>{children}</>;
};

// ResponsiveContainer needs to provide a container with size
export const ResponsiveContainer = ({ children, height, width }) => (
    <div style={{ 
        width: width || '100%', 
        height: height || '300px', 
        minHeight: '300px',
        background: 'rgba(79, 70, 229, 0.05)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #4F46E5',
        position: 'relative'
    }}>
        <div style={{ color: '#4F46E5', fontSize: '12px', position: 'absolute', top: '10px', left: '10px' }}>
            Chart Area Mock
        </div>
        {typeof children === 'function' ? children({ width: 400, height: 300 }) : children}
    </div>
);

// Explicitly export everything used in the app
export const BarChart = DummyComponent;
export const Bar = DummyComponent;
export const LineChart = DummyComponent;
export const Line = DummyComponent;
export const PieChart = DummyComponent;
export const Pie = DummyComponent;
export const Cell = DummyComponent;
export const XAxis = DummyComponent;
export const YAxis = DummyComponent;
export const CartesianGrid = DummyComponent;
export const Tooltip = DummyComponent;
export const Legend = DummyComponent;
export const Sector = DummyComponent;
export const AreaChart = DummyComponent;
export const Area = DummyComponent;
export const ComposedChart = DummyComponent;
export const ScatterChart = DummyComponent;
export const Scatter = DummyComponent;
export const Radar = DummyComponent;
export const RadarChart = DummyComponent;
export const PolarGrid = DummyComponent;
export const PolarAngleAxis = DummyComponent;
export const PolarRadiusAxis = DummyComponent;

export default new Proxy({}, {
    get: (target, prop) => {
        if (prop === 'ResponsiveContainer') return ResponsiveContainer;
        return DummyComponent;
    }
});
