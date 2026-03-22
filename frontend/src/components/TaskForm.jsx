import React, { useState } from 'react';

const TaskForm = ({ clientId, onTaskAdded, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        due_date: '',
        priority: 'Medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onTaskAdded({ ...formData, client_id: clientId, status: 'Pending' });
        setFormData({ title: '', description: '', category: '', due_date: '', priority: 'Medium' });
    };

    return (
        <div className="bg-white p-6 border-b">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Add New Task</h3>
                <button onClick={onCancel} className="text-gray-500 hover:text-red-500 text-sm">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <input
                        required
                        placeholder="Task Title"
                        className="w-full border p-2 rounded"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="col-span-2">
                    <textarea
                        placeholder="Description (optional)"
                        className="w-full border p-2 rounded h-20"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div>
                    <input
                        required
                        placeholder="Category (e.g., Tax, Filing)"
                        className="w-full border p-2 rounded"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>
                <div>
                    <input
                        required
                        type="date"
                        className="w-full border p-2 rounded"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                </div>
                <div className="col-span-2 flex justify-end">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                        Save Task
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
