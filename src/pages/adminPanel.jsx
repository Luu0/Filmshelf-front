import { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useMovieStore } from "../store/useMovieStore";
import PageLoader from "../Components/pageloader";
import { Redirect } from "wouter";

import { AdminHeader } from "../Components/adminPanel/adminHeader.jsx";
import { UserForm } from "../Components/adminPanel/adminUserForm.jsx";
import { UserTable } from "../Components/adminPanel/adminUserTable.jsx";

const AdminPanelContent = () => {
  const { users, loading, error, fetchUsers, deleteUser, updateUser } =
    useAdminStore();

  //state local
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [defaultFormValues, setDefaultFormValues] = useState(null);

  // useeffect para para cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = (data) => {
    if (editingId) {
      updateUser(editingId, data);
      resetForm();
    }
  };

  const handleEdit = (user) => {
    setDefaultFormValues({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setDefaultFormValues(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  // Cargas y errores
  if (loading && users.length === 0) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen text-center text-red-400 p-8 pt-20">
        Error loading users: {error}
      </div>
    );
  }

  // Renderizado del Contenido
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white p-4 pt-20 md:p-8 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader />

        {/* el formulario solo aparece si showForm es true cuandp se edita*/}
        {showForm && (
          <UserForm
            defaultValues={defaultFormValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        <UserTable users={users} onEdit={handleEdit} onDelete={deleteUser} />
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const { user, isAuthenticated, isAuthLoading } = useMovieStore();

  if (isAuthLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const isAdmin = user?.roles?.some((role) => role === "Admin") ?? false;

  if (isAdmin) {
    return <AdminPanelContent />;
  }

  return <Redirect to="/404" />;
}
