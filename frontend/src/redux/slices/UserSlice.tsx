import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email?: string;
  token?: string;
  isAuthenticated: boolean;
  firstName?: string;
  lastName?: string;
  department?: string;
  picture?: string;
}

interface UserState {
  user: User | null;
}

// Load user từ LocalStorage (chỉ lưu một user duy nhất)
const loadUserFromLocalStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem("userState");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing userState from localStorage:", error);
    return null;
  }
};

const initialState: UserState = {
  user: loadUserFromLocalStorage(),
};

export const UserSlice = createSlice({
  name: "userAction",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("userState", JSON.stringify(action.payload)); // Lưu vào LocalStorage
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userState"); // Xóa khỏi LocalStorage
    },
    refresh: (state) => {
      state.user = loadUserFromLocalStorage(); // Cập nhật lại từ LocalStorage
    },
  },
});

export const { login, logout, refresh } = UserSlice.actions;
export default UserSlice.reducer;
