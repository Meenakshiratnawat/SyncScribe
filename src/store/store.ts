import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import type { Tab } from "./uiSlice";

const STORAGE_KEY = "collabpad.activeTab";

function loadActiveTab(): Tab {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "comments" || raw === "versions" ? raw : "comments";
  } catch {
    return "comments";
  }
}

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  preloadedState: {
    ui: {
      activeTab: loadActiveTab(),
    },
  },
});

// Save whenever Redux state changes
store.subscribe(() => {
  try {
    const tab = store.getState().ui.activeTab;
    localStorage.setItem(STORAGE_KEY, tab);
  } catch {
    // ignore
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;