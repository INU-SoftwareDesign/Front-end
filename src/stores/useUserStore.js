import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../api/userApi';

/**
 * Zustand store for managing user information globally
 * Uses the persist middleware to save user data in localStorage
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      currentUser: null,
      isAuthenticated: false,
      
      // Actions
      login: (userData) => {
        set({ 
          currentUser: userData,
          isAuthenticated: true
        });
        return true;
      },
      
      logout: async () => {
        try {
          // userApi의 logoutUser 함수 호출 - 토큰 삭제 처리 포함
          await logoutUser();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // 상태 초기화
          set({ 
            currentUser: null,
            isAuthenticated: false
          });
        }
      },
      
      updateUserInfo: (updatedInfo) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            ...updatedInfo
          }
        }));
      },
      
      // Selectors (computed values)
      getUserRole: () => get().currentUser?.role || null,
      getUserId: () => get().currentUser?.id || null,
      getFullName: () => get().currentUser?.name || '',
      getProfileDetail: () => get().currentUser?.profileDetail || '',
      
      // Teacher-specific selectors
      getTeacherInfo: () => {
        const user = get().currentUser;
        if (user?.role !== 'teacher') return null;
        
        return {
          isHomeroom: user.isHomeroom || false,
          gradeLevel: user.gradeLevel || '',
          classNumber: user.classNumber || '',
          subjects: user.subjects || []
        };
      },
      
      // Student-specific selectors
      getStudentInfo: () => {
        const user = get().currentUser;
        if (user?.role !== 'student') return null;
        
        return {
          grade: user.grade || '',
          class: user.class || '',
          number: user.number || ''
        };
      },
      
      // Parent-specific selectors
      getParentInfo: () => {
        const user = get().currentUser;
        if (user?.role !== 'parent') return null;
        
        return {
          childName: user.childName || '',
          childDetail: user.childDetail || '',
          relationship: user.relationship || ''
        };
      },
      
      // Check if user is already logged in from localStorage
      checkAuth: () => {
        // This function is mostly for compatibility with the previous implementation
        // The persist middleware will automatically restore the state from localStorage
        // but we need this function for the useEffect in App.js
        return get().isAuthenticated;
      },
      
      // Authentication with backend using userApi
      loginWithCredentials: async (id, password) => {
        try {
          // userApi의 loginUser 함수 사용 - JWT 토큰 관리 포함
          const response = await loginUser({ id, password });
          
          if (response.success) {
            const userData = response.data.user;
            set({ 
              currentUser: userData,
              isAuthenticated: true
            });
            return { success: true };
          } else {
            return { success: false, message: response.message || '로그인에 실패했습니다.' };
          }
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, message: error.message || '로그인 중 오류가 발생했습니다.' };
        }
      }
    }),
    {
      name: 'user-storage', // name of the item in localStorage
      getStorage: () => localStorage, // storage provider
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      }), // only persist these fields
    }
  )
);

export default useUserStore;
