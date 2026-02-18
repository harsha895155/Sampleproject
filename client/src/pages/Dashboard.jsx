import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Banknote, CreditCard, Wallet } from '../shims/lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '../shims/recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/transactions/stats');
                setStats(statsRes.data.data);

                const txRes = await api.get('/transactions?limit=5');
                setTransactions(txRes.data.data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const data = [
        { name: 'Income', amount: stats.income },
        { name: 'Expense', amount: stats.expense },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.income}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.expense}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.balance}</p>
                    </div>
                </div>
            </div>

            {/* Charts & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {tx.category}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-center text-sm text-gray-500">No transactions yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
