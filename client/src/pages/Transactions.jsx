import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Edit2, Search } from '../shims/lucide-react';
import TransactionForm from '../components/TransactionForm';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({ type: '', category: '' });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let query = '';
            if (filter.type) query += `&type=${filter.type}`;
            if (filter.category) query += `&category=${filter.category}`;
            
            const res = await api.get(`/transactions?limit=100${query}`);
            setTransactions(res.data.data);
        } catch (err) {
            console.error("Error fetching transactions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter(t => t._id !== id));
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex space-x-4">
                <div className="flex-1">
                    <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="flex-1">
                     <input
                        type="text"
                        placeholder="Filter by Category"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : transactions.map((tx) => (
                            <tr key={tx._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.description}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:text-red-900 ml-4">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && transactions.length === 0 && (
                             <tr><td colSpan="6" className="text-center py-4 text-gray-500">No transactions found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <TransactionForm
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchTransactions}
                />
            )}
        </div>
    );
};

export default Transactions;
