import { useState } from "react";
import { Expense } from "@/types/types";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Omit<Expense, "id">) => void;
    expenses: Expense[];
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, expenses }) => {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!category || !amount || !description) {
            setError("所有字段均为必填项。");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSave({
                category,
                amount: parseFloat(amount),
                description,
                historyId: "", // This will be set in the parent component
            });
            setCategory("");
            setAmount("");
            setDescription("");
        } catch (err) {
            setError("保存开销失败，请重试。");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-4">管理开销</h2>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">添加新开销</h3>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="类别"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-gray-800"
                        />
                        <input
                            type="number"
                            placeholder="金额"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-gray-800"
                        />
                        <input
                            type="text"
                            placeholder="描述"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-gray-800"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "保存中..." : "添加开销"}
                    </button>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">现有开销</h3>
                    <ul className="space-y-2">
                        {expenses.map((expense) => (
                            <li key={expense.id} className="bg-gray-50 p-2 rounded border border-gray-200">
                                <div className="flex justify-between">
                                    <span>{expense.category}</span>
                                    <span>${expense.amount.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-500">{expense.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    关闭
                </button>
            </div>
        </div>
    );
};

export default ExpenseModal;