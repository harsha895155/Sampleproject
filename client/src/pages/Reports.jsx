import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, 
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from '../shims/recharts';
import { Download, Filter } from '../shims/lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const Reports = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('expense');
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchData = async () => {
        setLoading(true);
        try {
            const catRes = await api.get(`/transactions/category-stats?type=${type}`);
            setCategoryData(catRes.data.data);

            const monthRes = await api.get(`/transactions/monthly-stats?type=${type}&year=${year}`);
            setMonthlyData(monthRes.data.data);
        } catch (err) {
            console.error("Error fetching reports data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [type, year]);

    const handleExport = () => {
        // In a real app, this would trigger a CSV/PDF download
        alert("Exporting report as CSV...");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading analysis...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => setType('expense')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'expense' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                        >
                            Expenses
                        </button>
                        <button 
                            onClick={() => setType('income')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'income' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                        >
                            Income
                        </button>
                    </div>

                    <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {[0, 1, 2].map(i => {
                            const y = new Date().getFullYear() - i;
                            return <option key={y} value={y}>{y}</option>;
                        })}
                    </select>

                    <button 
                        onClick={handleExport}
                        className="flex items-center space-x-2 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Category Breakdown</h2>
                    <div className="h-80">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="amount"
                                        nameKey="_id"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No data available for this selection
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Trends</h2>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Analysis Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Summarized Table</h2>
                    <span className="text-sm font-medium text-gray-500 uppercase">Total: ${categoryData.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">% of Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {categoryData.map((row, index) => {
                                const total = categoryData.reduce((acc, curr) => acc + curr.amount, 0);
                                const percentage = ((row.amount / total) * 100).toFixed(1);
                                return (
                                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                <span className="text-sm font-medium text-gray-900 capitalize">{row._id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">${row.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{percentage}%</td>
                                    </tr>
                                );
                            })}
                            {categoryData.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-400">No data found in this period</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
