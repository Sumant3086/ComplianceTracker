import React, { useState } from 'react';
import { format, isBefore, startOfToday } from 'date-fns';

const TaskList = ({ tasks, onToggleStatus }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', ...new Set(tasks.map(t => t.category))];
    const statuses = ['All', 'Pending', 'Completed'];

    const filteredTasks = tasks.filter(t => {
        if (filterStatus !== 'All' && t.status !== filterStatus) return false;
        if (filterCategory !== 'All' && t.category !== filterCategory) return false;
        return true;
    });

    const today = startOfToday();

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
                <div className="flex gap-4">
                    <select
                        className="border p-2 rounded text-sm bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="border p-2 rounded text-sm bg-white"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-gray-500 p-8 text-center bg-white rounded shadow-sm">No tasks match your filters.</div>
                ) : (
                    filteredTasks.map(task => {
                        const isOverdue = task.status === 'Pending' && isBefore(new Date(task.due_date), today);

                        return (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg border bg-white shadow-sm flex justify-between items-center transition-all ${isOverdue ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.title}
                                        </h3>
                                        {isOverdue && (
                                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
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
