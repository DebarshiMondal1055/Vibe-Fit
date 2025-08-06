import { create } from "zustand";

const useShowSideBarStore = create((set) => ({
  showSideBar: true,
  toggleSideBar: () =>
    set((state) => ({ showSideBar: !state.showSideBar })),
}));

export { useShowSideBarStore };
