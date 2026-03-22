import React, { useState } from 'react';
import { format, isBefore, startOfToday } from 'date-fns';
import { Search, SortAsc, SortDesc } from 'lucide-react';

const TaskList = ({ tasks, onToggleStatus }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const categories = ['All', ...new Set(tasks.map(t => t.category))];
    const statuses = ['All', 'Pending', 'Completed'];
    const today = startOfToday();

    // Stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const overdueTasks = tasks.filter(t => t.status === 'Pending' && isBefore(new Date(t.due_date), today)).length;

    const filteredTasks = tasks.filter(t => {
        if (filterStatus !== 'All' && t.status !== filterStatus) return false;
        if (filterCategory !== 'All' && t.category !== filterCategory) return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Total Tasks</div>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Completed</div>
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200 bg-red-50">
                    <div className="text-red-500 text-sm font-medium">Overdue</div>
                    <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="border p-2 rounded-md text-sm bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="border p-2 rounded-md text-sm bg-white"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="border p-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                        title="Sort by Due Date"
                    >
                        {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                        Sort
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-gray-500 p-8 text-center bg-white rounded shadow-sm border border-dashed">No tasks match your filters.</div>
                ) : (
                    filteredTasks.map(task => {
                        const isOverdue = task.status === 'Pending' && isBefore(new Date(task.due_date), today);

                        return (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg border bg-white shadow-sm flex justify-between items-center transition-all ${isOverdue ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-indigo-300'}`}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.title}
                                        </h3>
                                        {isOverdue && (
                                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                OVERDUE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                    <div className="flex gap-3 mt-3 text-xs font-medium text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded">Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{task.category}</span>
                                        <span className={`${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-1 rounded`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onToggleStatus(task)}
                                    className={`px-4 py-2 rounded font-medium text-sm transition-colors ${task.status === 'Completed' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                >
                                    {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TaskList;
