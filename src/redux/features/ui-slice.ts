import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isCartSidebarOpen: boolean;
}

const initialState: UiState = {
  isCartSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCartSidebar: (state) => {
      state.isCartSidebarOpen = !state.isCartSidebarOpen;
    },
    openCartSidebar: (state) => {
      state.isCartSidebarOpen = true;
    },
    closeCartSidebar: (state) => {
      state.isCartSidebarOpen = false;
    },
  },
});

export const { toggleCartSidebar, openCartSidebar, closeCartSidebar } = uiSlice.actions;

export default uiSlice.reducer;
