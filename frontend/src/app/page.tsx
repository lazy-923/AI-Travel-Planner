"use client";
import React, { useState, useEffect, useRef } from 'react';
import Map from './components/Map';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { usePlanStore } from "@/store";
import ExpenseModal from "@/components/ExpenseModal";
import BudgetAnalysisChart from "@/components/BudgetAnalysisChart";
import BudgetModal from "@/components/BudgetModal";
import { TravelHistory, Expense, Budget } from "@/types/types";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();
  const [locations, setLocations] = useState<{ name: string; lng: number; lat: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [city, setCity] = useState("");
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<TravelHistory | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [budget, setBudget] = useState<any>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const { loadedPlan, clearLoadedPlan } = usePlanStore();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setUserLoading(false);
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (loadedPlan) {
      setResponse(loadedPlan.response);
      if (loadedPlan.locations) {
        try {
          const parsedLocations = JSON.parse(loadedPlan.locations);
          if (Array.isArray(parsedLocations)) {
            setLocations(parsedLocations.map((loc: any) => ({
              name: loc.name,
              lng: loc.lng,
              lat: loc.lat,
            })));
          }
        } catch (e) {
          console.error("Failed to parse locations:", e);
          setLocations([]);
        }
      }
      setDestination(loadedPlan.query);
      setSelectedHistory(loadedPlan);
      setIsFromHistory(true);
      clearLoadedPlan();
    }
  }, [loadedPlan, clearLoadedPlan]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'zh-CN';
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setDestination(transcript);
      };
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
      recognitionRef.current = recognitionInstance;
    }
  }, []);

  const handleGenerate = async () => {
    if (!destination.trim() || !user) return;
    setLoading(true);
    setResponse('');
    setLocations([]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: destination, user_id: user.id, preferences: '' }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.plan);
      setCity(data.city);
      setIsSaved(false);

      if (data.locations && data.locations.length > 0) {
        const validLocations = data.locations
          .filter((loc: any) => loc.location)
          .map((loc: any) => {
            const [lng, lat] = loc.location.split(',');
            return { name: loc.name, lng: parseFloat(lng), lat: parseFloat(lat) };
          });
        setLocations(validLocations);
      }

    } catch (error) {
      console.error('Error generating travel plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!response || !user) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          query: destination,
          response: response,
          city: city,
          locations: JSON.stringify(locations),
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        alert('计划保存成功！');
      } else {
        throw new Error('保存计划失败。');
      }
    } catch (error) {
      console.error('Error saving travel plan:', error);
      alert('保存计划时出错。');
    }
  };

  const handleToggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleManageExpenses = async () => {
    if (!selectedHistory || !user) return;
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", selectedHistory.id)
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

  const handleGetBudget = async () => {
    if (!selectedHistory) return;
    setLoadingBudget(true);
    setIsViewMode(false);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: selectedHistory.response }),
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

      setIsBudgetModalOpen(false);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleViewBudget = async () => {
    if (!selectedHistory || !user) return;
    setIsViewMode(true);
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("history_id", selectedHistory.id)
        .eq("user_id", user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found error

      if (data) {
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
        ({ data, error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expense.id)
          .select());
      } else {
        ({ data, error } = await supabase
          .from('expenses')
          .insert(expenseData)
          .select());
      }

      if (error) throw error;

      if (data) {
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

  const handleCreateNewPlan = () => {
    setDestination("");
    setResponse('');
    setLocations([]);
    setIsFromHistory(false);
    setSelectedHistory(null);
    setIsSaved(false);
    setCity("");
  };

  if (userLoading || !user) {
    return <div>加载中...</div>;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-screen">
      <Map locations={locations} />
      <div className="absolute top-0 left-4 z-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-96 h-full overflow-y-auto">
        <textarea
          className="w-full p-2 border rounded-md mb-1"
          rows={2}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="您的旅行计划... (例如, '我想去北京，5 天，预算 1 万元，喜欢历史，带孩子')"
          disabled={isFromHistory}
        />
        <div className="flex space-x-2 mb-1">
          <button
            className="w-full bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleGenerate}
            disabled={loading || isFromHistory}
          >
            {loading ? '生成中...' : '生成计划'}
          </button>
          <button
            className={`w-full p-1 rounded-md text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} disabled:bg-gray-400`}
            onClick={handleToggleRecording}
            disabled={isFromHistory}
          >
            {isRecording ? '停止录音' : '开始录音'}
          </button>
        </div>
        {response && (
          <>
            <button
              className="w-full bg-green-500 text-white p-1 rounded-md hover:bg-green-600 disabled:bg-gray-400 mb-2"
              onClick={handleSave}
              disabled={isSaved || isFromHistory}
            >
              {isSaved ? '计划已保存' : '保存计划'}
            </button>
            {isFromHistory && (
              <div className="flex flex-col space-y-1 mb-2">
                <button
                  className="w-full bg-indigo-500 text-white p-1 rounded-md hover:bg-indigo-600"
                  onClick={handleCreateNewPlan}
                >
                  创建新计划
                </button>
                <div className="flex space-x-2">
                  <button
                    className="w-full bg-yellow-500 text-white p-1 rounded-md hover:bg-yellow-600"
                    onClick={handleManageExpenses}
                  >
                    管理开销
                  </button>
                  <button
                    className="w-full bg-purple-500 text-white p-1 rounded-md hover:bg-purple-600"
                    onClick={selectedHistory?.has_budget ? handleViewBudget : handleGetBudget}
                  >
                    {selectedHistory?.has_budget ? '查看预算' : '智能预算'}
                  </button>
                </div>
              </div>
            )}
            <div className="mt-2 max-h-80 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-2">您的旅行计划:</h2>
              <pre className="whitespace-pre-wrap font-sans">{response}</pre>
            </div>
          </>
        )}
      </div>
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
    </div>
  );
}