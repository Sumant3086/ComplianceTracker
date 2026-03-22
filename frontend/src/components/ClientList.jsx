import React from 'react';

const ClientList = ({ clients, selectedClient, onSelectClient }) => {
    return (
        <div className="w-1/4 bg-white border-r h-full overflow-y-auto">
            <div className="p-4 border-b font-bold text-lg text-gray-800">
                Clients
            </div>
            <ul className="divide-y">
                {clients.map(client => (
                    <li
                        key={client.id}
                        onClick={() => onSelectClient(client)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedClient?.id === client.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                    >
                        <div className="font-semibold text-gray-800">{client.company_name}</div>
                        <div className="text-sm text-gray-500">{client.entity_type} • {client.country}</div>
                    </li>
                ))}
                {clients.length === 0 && (
                    <div className="p-4 text-gray-500 text-sm">No clients found.</div>
                )}
            </ul>
        </div>
    );
};

export default ClientList;
