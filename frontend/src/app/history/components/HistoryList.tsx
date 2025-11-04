import { TravelHistory } from "@/types/types";
import { useState } from "react";

interface HistoryListProps {
    history: TravelHistory[];
    onEdit: (historyItem: TravelHistory) => void;
    onDelete: (id: string) => void;
    onManageExpenses: (historyItem: TravelHistory) => void;
    onGetBudget: (historyItem: TravelHistory) => void;
    onViewBudget: (historyItem: TravelHistory) => void;
    onLoadToMap: (historyItem: TravelHistory) => void; // Add this line
    editingHistoryId: string | null;
    onSave: (updatedHistory: TravelHistory) => void;
    onCancelEdit: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onEdit, onDelete, onManageExpenses, onGetBudget, onViewBudget, onLoadToMap, editingHistoryId, onSave, onCancelEdit }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");

    const handleToggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (item: TravelHistory) => {
        setCurrentQuery(item.query);
        setCurrentResponse(item.response);
        setExpandedId(item.id); // Ensure the item is expanded when editing
        onEdit(item);
    };

    const handleSaveClick = (item: TravelHistory) => {
        onSave({ ...item, query: currentQuery, response: currentResponse });
    };

    return (
        <ul className="space-y-4">
            {history.map((item) => (
                <li key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-grow cursor-pointer mr-4" onClick={() => handleToggleExpand(item.id)}>
                                <h3 className="text-lg font-semibold text-gray-800">{item.query}</h3>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button onClick={() => onLoadToMap(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs">
                                    加载到地图
                                </button>
                                {item.has_budget ? (
                                    <button onClick={() => onViewBudget(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs">
                                        查看预算
                                    </button>
                                ) : (
                                    <button onClick={() => onGetBudget(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs">
                                        智能预算
                                    </button>
                                )}
                                <button onClick={() => onManageExpenses(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs">
                                    管理开支
                                </button>
                                <button onClick={() => handleEditClick(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs">
                                    编辑
                                </button>
                                <button onClick={() => onDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs">
                                    删除
                                </button>
                                <span className="text-gray-500 cursor-pointer" onClick={() => handleToggleExpand(item.id)}>
                                    {expandedId === item.id ? '▲' : '▼'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {(expandedId === item.id || editingHistoryId === item.id) && (
                        <div className="p-4 border-t border-gray-200">
                            {editingHistoryId === item.id ? (
                                <div>
                                    <textarea
                                        value={currentQuery}
                                        onChange={(e) => setCurrentQuery(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mb-2 text-gray-800"
                                    />
                                    <textarea
                                        value={currentResponse}
                                        onChange={(e) => setCurrentResponse(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mb-4 text-gray-800"
                                        rows={18}
                                    />
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleSaveClick(item)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded">
                                            保存
                                        </button>
                                        <button onClick={onCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">
                                            取消
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {item.response}
                                </p>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default HistoryList;