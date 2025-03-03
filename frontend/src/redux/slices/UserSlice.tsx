import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  token: string;
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
  department: string;
  picture: string;
};

interface UserState {
  user: User[];
};

const loadUserFromLocalStorage = (): User[] => {
  try {
    const storedUser = localStorage.getItem('userState');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (Array.isArray(parsedUser)) {
        return parsedUser;
      }
    }
    return []; // Trả về mảng trống nếu không có dữ liệu hoặc không đúng định dạng
  } catch (error) {
    console.error('Error parsing userState from localStorage:', error);
    return [];
  }
};

const initialState: UserState = {
  user: loadUserFromLocalStorage(), // Load state từ localStorage
};

export const UserSlice = createSlice({
  name: 'userAction',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      // Đảm bảo state.user là mảng trước khi thêm phần tử
      if (Array.isArray(state.user)) {
        state.user.push(action.payload);
        localStorage.setItem('userState', JSON.stringify(state.user)); // Lưu vào LocalStorage
      } else {
        console.error('Expected state.user to be an array');
      }
    },
    logout: (state) => {
      state.user = [];
      localStorage.removeItem('userState'); // Xóa khỏi LocalStorage
    },
    refresh: (state) => {
      // Đồng bộ lại state.user từ localStorage mỗi khi refresh
      const refreshedUser = loadUserFromLocalStorage(); // Cập nhật lại từ localStorage
      if (Array.isArray(refreshedUser)) {
        state.user = refreshedUser;
      }
    }
  }
});

export const { login, logout, refresh } = UserSlice.actions;
export default UserSlice.reducer;
