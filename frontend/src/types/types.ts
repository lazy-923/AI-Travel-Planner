export interface TravelHistory {
    id: string;
    query: string;
    response: string;
    user_id: string;
    locations: string;
    created_at: string;
    has_budget?: boolean;
}

export interface Expense {
    id: string;
    historyId: string;
    category: string;
    amount: number;
    description: string;
}

export interface Budget {
    id: string;
    historyId: string;
    amount: number;
}