import { create } from 'zustand';
import { TravelHistory } from '@/types/types';

interface PlanState {
    loadedPlan: TravelHistory | null;
    setLoadedPlan: (plan: TravelHistory) => void;
    clearLoadedPlan: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
    loadedPlan: null,
    setLoadedPlan: (plan) => set({ loadedPlan: plan }),
    clearLoadedPlan: () => set({ loadedPlan: null }),
}));