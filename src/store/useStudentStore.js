// src/store/useStudentStore.js
import { create } from "zustand";

const useStudentStore = create((set) => ({
  search: "",
  selectedGrade: "1학년",
  selectedClass: "1반",
  setSearch: (value) => set({ search: value }),
  setGrade: (grade) => set({ selectedGrade: grade }),
  setClass: (cls) => set({ selectedClass: cls }),
}));

export default useStudentStore;
