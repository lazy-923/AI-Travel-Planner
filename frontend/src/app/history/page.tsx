'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoryList from "./components/HistoryList";
import ExpenseModal from "@/components/ExpenseModal";
import BudgetAnalysisChart from "@/components/BudgetAnalysisChart";
import BudgetModal from "@/components/BudgetModal";
import { TravelHistory, Expense, Budget } from "@/types/types";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { usePlanStore } from "@/store"; // Import the Zustand store

const HistoryPage = () => {
    const [history, setHistory] = useState<TravelHistory[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<TravelHistory | null>(
        null
    );
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [budget, setBudget] = useState<any>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loadingBudget, setLoadingBudget] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const setLoadedPlan = usePlanStore((state) => state.setLoadedPlan); // Get the action from the store

    useEffect(() => {
        const fetchHistory = async (user: User) => {
            // Step 1: Fetch all history records
            const { data: historyData, error: historyError } = await supabase
                .from("history")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (historyError) {
                console.error("Error fetching history:", historyError);
                return;
            }

            if (historyData) {
                // Step 2: Get all history IDs
                const historyIds = historyData.map(item => item.id);

                // Step 3: Find which of these IDs have a budget
                const { data: budgetData, error: budgetError } = await supabase
                    .from("budgets")
                    .select("history_id")
                    .in("history_id", historyIds);

                if (budgetError) {
                    console.error("Error fetching budgets:", budgetError);
                    // Even if budget check fails, show the history
                    setHistory(historyData.map(item => ({ ...item, has_budget: false })));
                    return;
                }

                // Step 4: Create a set of history IDs that have a budget for quick lookup
                const budgetedHistoryIds = new Set(budgetData.map(b => b.history_id));

                // Step 5: Map the budget status to the history items
                const historyWithBudgetStatus = historyData.map((item) => ({
                    ...item,
                    has_budget: budgetedHistoryIds.has(item.id),
                }));

                setHistory(historyWithBudgetStatus);
            }
        };

        const checkUser = async () => {
            const { data: { user }, } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                fetchHistory(user);
            } else {
                router.push("/login");
            }
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (event === 'SIGNED_IN' && currentUser) {
                    fetchHistory(currentUser);
                } else if (event === 'SIGNED_OUT') {
                    router.push("/login");
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    const handleLoadToMap = (historyItem: TravelHistory) => {
        setLoadedPlan(historyItem);
        router.push('/');
    };

    const handleEdit = (historyItem: TravelHistory) => {
        setEditingHistoryId(historyItem.id);
    };

    const handleCancelEdit = () => {
        setEditingHistoryId(null);
    };

    const handleUpdateHistory = async (updatedHistory: TravelHistory) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("history")
                .update({ query: updatedHistory.query, response: updatedHistory.response })
                .eq("id", updatedHistory.id)
                .eq("user_id", user.id)
                .select();
            if (error) throw error;
            if (data) {
                setHistory(
                    history.map((h) => (h.id === updatedHistory.id ? data[0] : h))
                );
            }
            setEditingHistoryId(null);
        } catch (error) {
            console.error("Error updating history:", error);
        }
    };

    const handleSaveExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'user_id' | 'trip_id'> & { id?: number }) => {
        if (!selectedHistory || !user) return;

        const expenseData = {
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            user_id: user.id,
            trip_id: selectedHistory.id,
        };

        try {
            let data, error;
            if (expense.id) {
                // Update existing expense
                ({ data, error } = await supabase
                    .from('expenses')
                    .update(expenseData)
                    .eq('id', expense.id)
                    .select());
            } else {
                // Create new expense
                ({ data, error } = await supabase
                    .from('expenses')
                    .insert(expenseData)
                    .select());
            }

            if (error) throw error;

            if (data) {
                // Refresh expenses list by re-fetching
                const { data: updatedExpenses, error: fetchError } = await supabase
                    .from("expenses")
                    .select("*")
                    .eq("trip_id", selectedHistory.id)
                    .eq("user_id", user.id);

                if (fetchError) throw fetchError;
                setExpenses(updatedExpenses || []);
            }
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const handleDeleteHistory = async (id: string) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('history')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setHistory(history.filter((h) => h.id !== id));
        } catch (error) {
            console.error("Error deleting history:", error);
        }
    };

    const handleManageExpenses = async (historyItem: TravelHistory) => {
        if (!user) return;
        setSelectedHistory(historyItem);
        try {
            const { data, error } = await supabase
                .from("expenses")
                .select("*")
                .eq("trip_id", historyItem.id)
                .eq("user_id", user.id);

            if (error) {
                throw error;
            }
            setExpenses(data || []);
            setIsExpenseModalOpen(true);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleGetBudget = async (item: TravelHistory) => {
        setSelectedHistory(item);
        setLoadingBudget(true);
        setIsViewMode(false);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan: item.response }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch budget');
            }
            const data = await response.json();
            setBudget(data.budget);
            setIsBudgetModalOpen(true);
        } catch (error) {
            console.error("Error fetching budget:", error);
        } finally {
            setLoadingBudget(false);
        }
    };

    const handleSaveBudget = async (budget: any) => {
        if (!selectedHistory || !user) return;
        try {
            const { data, error } = await supabase
                .from("budgets")
                .insert([{
                    history_id: selectedHistory.id,
                    user_id: user.id,
                    budget_details: JSON.stringify(budget)
                }])
                .select();

            if (error) throw error;

            if (data) {
                // Update the history in the state to reflect that it now has a budget
                setHistory(prevHistory =>
                    prevHistory.map(h =>
                        h.id === selectedHistory.id ? { ...h, has_budget: true } : h
                    )
                );
            }
            setIsBudgetModalOpen(false);
        } catch (error) {
            console.error("Error saving budget:", error);
        }
    };

    const handleViewBudget = async (historyItem: TravelHistory) => {
        if (!user) return;
        setSelectedHistory(historyItem);
        setIsViewMode(true);
        try {
            const { data, error } = await supabase
                .from("budgets")
                .select("*")
                .eq("history_id", historyItem.id)
                .eq("user_id", user.id)
                .single();
            if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found error

            if (data) {
                // The budget_details from the database is a JSON string
                const budgetDetails = JSON.parse(data.budget_details);
                setBudget(budgetDetails);
            } else {
                setBudget(null);
            }

            setIsBudgetModalOpen(true);
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    const handleAnalyzeBudget = async (historyItem: TravelHistory) => {
        if (!user) return;
        setSelectedHistory(historyItem);
        try {
            const { data: expensesData, error: expensesError } = await supabase
                .from("expenses")
                .select("*")
                .eq("trip_id", historyItem.id)
                .eq("user_id", user.id);
            if (expensesError) throw expensesError;
            setExpenses(expensesData || []);

            const { data: budgetData, error: budgetError } = await supabase
                .from("budgets")
                .select("*")
                .eq("history_id", historyItem.id)
                .eq("user_id", user.id)
                .single();
            if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;
            setBudget(budgetData);

            setIsAnalysisModalOpen(true);
        } catch (error) {
            console.error("Error preparing analysis:", error);
        }
    };

    if (!user) {
        return <div>加载中...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">历史记录</h1>
                <HistoryList
                    history={history}
                    onEdit={handleEdit}
                    onDelete={handleDeleteHistory}
                    onManageExpenses={handleManageExpenses}
                    onGetBudget={handleGetBudget}
                    onViewBudget={handleViewBudget}
                    onLoadToMap={handleLoadToMap} // Pass the handler to the list
                    editingHistoryId={editingHistoryId}
                    onSave={handleUpdateHistory}
                    onCancelEdit={handleCancelEdit}
                />
                {isExpenseModalOpen && selectedHistory && (
                    <ExpenseModal
                        isOpen={isExpenseModalOpen}
                        onClose={() => setIsExpenseModalOpen(false)}
                        onSave={handleSaveExpense}
                        expenses={expenses}
                    />
                )}
                {isBudgetModalOpen && selectedHistory && (
                    <BudgetModal
                        isOpen={isBudgetModalOpen}
                        onClose={() => setIsBudgetModalOpen(false)}
                        onSave={handleSaveBudget}
                        budget={budget}
                        isViewMode={isViewMode}
                    />
                )}
                {isAnalysisModalOpen && selectedHistory && (
                    <BudgetAnalysisChart
                        isOpen={isAnalysisModalOpen}
                        onClose={() => setIsAnalysisModalOpen(false)}
                        expenses={expenses}
                        budget={budget?.amount}
                    />
                )}
            </div>
        </div>
    );
};

export default HistoryPage;