
import { TravelHistory } from "@/types/types";
import { useState, useEffect } from "react";

interface EditHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedHistory: TravelHistory) => void;
    historyItem: TravelHistory;
}

const EditHistoryModal: React.FC<EditHistoryModalProps> = ({ isOpen, onClose, onSave, historyItem }) => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");

    useEffect(() => {
        if (historyItem) {
            setQuery(historyItem.query);
            setResponse(historyItem.response);
        }
    }, [historyItem]);

    const handleSave = () => {
        onSave({ ...historyItem, query, response });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Edit History</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Query</label>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                        rows={4}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Response</label>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                        rows={8}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditHistoryModal;