import { ref, computed } from "vue";

interface AccountMetrics {
  totalPaid: number;
  totalOverdue: number;
  totalDraft: number;
  paidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export const useAccounts = () => {
  // Metrics state
  const metrics = ref<AccountMetrics>({
    totalPaid: 400689,
    totalOverdue: 150000,
    totalDraft: 75000,
    paidInvoices: 5,
    overdueInvoices: 3,
    draftInvoices: 2,
  });

  // Transactions state
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties for analytics
  const totalRevenue = computed(() => {
    return transactions.value
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const totalExpenses = computed(() => {
    return transactions.value
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const balance = computed(() => {
    return totalRevenue.value - totalExpenses.value;
  });

  // Methods
  const fetchTransactions = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: Implement API call to fetch transactions
      // For now using mock data
      transactions.value = [
        {
          id: "1",
          date: "2025-09-01",
          description: "Monthly Rent Payment",
          amount: 150000,
          type: "income",
          paymentMethod: "bank_transfer",
          status: "completed",
        },
        {
          id: "2",
          date: "2025-09-05",
          description: "Maintenance Service",
          amount: 50000,
          type: "expense",
          paymentMethod: "cash",
          status: "completed",
        },
      ];
    } catch (e) {
      error.value = "Failed to fetch transactions";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: Implement API call to add transaction
      const newTransaction = {
        id: Date.now().toString(),
        ...transaction,
      };
      transactions.value.unshift(newTransaction);
      return newTransaction;
    } catch (e) {
      error.value = "Failed to add transaction";
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateMetrics = async () => {
    // TODO: Implement API call to update metrics
  };

  return {
    metrics,
    transactions,
    isLoading,
    error,
    totalRevenue,
    totalExpenses,
    balance,
    fetchTransactions,
    addTransaction,
    updateMetrics,
  };
};
