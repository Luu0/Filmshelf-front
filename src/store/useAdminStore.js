import { create } from "zustand";
import { getUsers, updateUser, deleteUser} from "../services/adminService";

export const useAdminStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const usersFromApi = await getUsers();
      const mappedUsers = usersFromApi.map(user => ({
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.roles?.[0] || "user"
      }));
      set({ users: mappedUsers, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateUser: async (userId, updatedData) => {
    try {
      await updateUser(userId, updatedData);
      await get().fetchUsers(); 
    } catch (error) {
      set({ error: error.message });
      console.error("Error al actualizar usuario:", error);
    }
  },

  deleteUser: async (userId) => {
    try {
      await deleteUser(userId);
      await get().fetchUsers(); 
    } catch (error) {
      set({ error: error.message });
      console.error("Error al borrar usuario:", error);
    }
  },
}));