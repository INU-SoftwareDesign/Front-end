// src/store/useStudentStore.js
import { create } from "zustand";
import { getStudents } from "../api/studentApi";

const useStudentStore = create((set, get) => ({
  // Filter state
  search: "",
  selectedGrade: "1", // Changed to match API format
  selectedClassNumber: "1", // Changed to match API format
  
  // Data state
  students: [],
  isLoading: false,
  error: null,
  
  // Filter actions
  setSearch: (value) => set({ search: value }),
  setGrade: (grade) => set({ selectedGrade: grade }),
  setClass: (cls) => set({ selectedClassNumber: cls }),
  
  // Data actions
  fetchStudents: async () => {
    const { search, selectedGrade, selectedClassNumber } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      // Prepare query parameters
      const params = {
        grade: selectedGrade,
        classNumber: selectedClassNumber
      };
      
      // Add search parameter if it exists
      if (search) {
        params.search = search;
      }
      
      // Call API to get students
      const students = await getStudents(params);
      
      set({ students, isLoading: false });
      return students;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },
  
  // Reset filters
  resetFilters: () => set({ search: "", selectedGrade: "1", selectedClassNumber: "1" }),
}));

export default useStudentStore;
