import { api } from "../utils/api.js";

// trae los usuarios (requiere rol Admin/Mod)
export const getUsers = async () => {
  const res = await api.get("/filmshelf/users");
  return res.data;
};

// actualiza un usuario (formData es { name, email, role })
export const updateUser = async (id, formData) => {
  const apiData = {
    userName: formData.name,
    email: formData.email,
    role: formData.role,
  };
  const res = await api.put(`/filmshelf/users/${id}`, apiData);
  return res.data;
};

// borra un usuario
export const deleteUser = async (id) => {
  await api.delete(`/filmshelf/users/${id}`);
};
