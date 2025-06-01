import { create } from 'zustand';

export const useReportStore = create((set) => ({
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  reportData: {
    personalInfo: null,
    grades: null,
    attendance: null,
    specialNotes: null,
    feedback: null,
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setLoading: (status) => set({ loading: status }),
  setError: (error) => set({ error }),
  
  setReportData: (data) => set((state) => ({
    reportData: { ...state.reportData, ...data }
  })),

  resetReportData: () => set({
    reportData: {
      personalInfo: null,
      grades: null,
      attendance: null,
      specialNotes: null,
      feedback: null,
    }
  }),
}));
