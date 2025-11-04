'use client';

import { useState, useEffect } from 'react';

interface ProfileFormProps {
    user: any;
    onUpdate: (name: string) => void;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (user?.user_metadata?.user_name) {
            setUsername(user.user_metadata.user_name);
        }
    }, [user]);

    const handleUpdate = () => {
        onUpdate(username);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">个人信息</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">电子邮件</label>
                    <input
                        type="email"
                        id="email"
                        value={user?.email || ''}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-500"
                    />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    更新信息
                </button>
            </div>
        </div>
    );
}