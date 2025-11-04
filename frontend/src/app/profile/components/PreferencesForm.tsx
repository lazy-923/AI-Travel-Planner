interface Preferences {
    [key: string]: boolean | string;
}

interface PreferenceCategories {
    [category: string]: {
        [key: string]: string;
    };
}

interface PreferencesFormProps {
    preferences: Preferences;
    preferenceCategories: PreferenceCategories;
    handlePreferenceChange: (key: string, value?: string) => void;
    handleUpdatePreferences: () => void;
}

export default function PreferencesForm({ preferences, preferenceCategories, handlePreferenceChange, handleUpdatePreferences }: PreferencesFormProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">偏好设置</h2>

            <div className="space-y-6">
                {Object.entries(preferenceCategories).map(([category, labels]) => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {Object.keys(labels).map(key => (
                                <div key={key} className="flex items-center">
                                    {key === 'custom' ? (
                                        <input
                                            type="text"
                                            value={preferences[key] as string || ''}
                                            onChange={(e) => handlePreferenceChange(key, e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="自定义偏好"
                                        />
                                    ) : (
                                        <>
                                            <input
                                                type="checkbox"
                                                id={key}
                                                checked={!!preferences[key]}
                                                onChange={() => handlePreferenceChange(key)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={key} className="ml-2 block text-sm text-gray-900">{labels[key]}</label>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={handleUpdatePreferences} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    更新偏好
                </button>
            </div>
        </div>
    );
}