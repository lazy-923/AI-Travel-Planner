import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Expense } from "@/types/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetAnalysisChartProps {
    expenses: Expense[];
    isOpen: boolean;
    onClose: () => void;
}

const BudgetAnalysisChart: React.FC<BudgetAnalysisChartProps> = ({ expenses, isOpen, onClose }) => {
    if (!isOpen) return null;

    const data = {
        labels: expenses.map((exp) => exp.category),
        datasets: [
            {
                data: expenses.map((exp) => exp.amount),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            },
        ],
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">开销分析</h2>
                {expenses.length > 0 ? (
                    <Pie data={data} />
                ) : (
                    <p className="text-center text-gray-400">没有可供显示的开销数据。</p>
                )}
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

export default BudgetAnalysisChart;