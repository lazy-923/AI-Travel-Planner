import React from 'react';

// The budget object from the AI will have a complex structure
interface AiBudget {
    total_budget: number;
    currency: string;
    budget_breakdown: {
        category: string;
        amount: number;
        details: string;
    }[];
}

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (budget: AiBudget) => void;
    budget: AiBudget | null; // It can be null initially
    isViewMode: boolean; // To distinguish between viewing and generating
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSave, budget, isViewMode }) => {
    const handleSave = () => {
        if (budget) {
            onSave(budget);
        }
    };

    if (!isOpen || !budget) return null;

    // Function to render budget details
    const renderBudgetDetails = () => {
        // The AI response is a stringified JSON, so we need to parse it.
        // The view mode budget from DB is already a JSON object.
        const budgetData = typeof budget === 'string' ? JSON.parse(budget) : budget;

        // Handle cases where budgetData might not have the expected structure
        if (!budgetData || !budgetData.total_budget) {
            // Fallback for old simple budget (number)
            if (typeof budgetData === 'number' || (budgetData && budgetData.amount)) {
                const amount = typeof budgetData === 'number' ? budgetData : budgetData.amount;
                return (
                    <div>
                        <h3 className="text-lg font-semibold">预估总预算</h3>
                        <p className="text-xl">{amount} CNY</p>
                        <p className="text-sm text-gray-500 mt-2">这是一个之前保存的简单预算。</p>
                    </div>
                )
            }
            return <p>预算详情格式不正确。</p>;
        }


        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">预估总预算</h3>
                    <p className="text-xl">{budgetData.total_budget} {budgetData.currency}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">预算明细</h3>
                    <ul className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                        {budgetData.budget_breakdown.map((item: any, index: number) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between font-medium">
                                    <span>{item.category}</span>
                                    <span>{item.amount} {budgetData.currency}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg text-gray-800 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">{isViewMode ? "查看预算" : "AI 生成的预算"}</h2>
                {renderBudgetDetails()}
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        关闭
                    </button>
                    {!isViewMode && (
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            保存预算
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetModal;