import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminUserSchema } from "../../schema/zodAdminUserSchema";

export const UserForm = ({ defaultValues, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      role: "User",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            {...register("name")}
            placeholder="Nombre completo"
            className={`bg-[#1a1a1a] border rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none ${
              errors.name
                ? "border-red-500 focus:border-red-500"
                : "border-gray-600 focus:border-blue-500"
            }`}
          />
          {errors.name && (
            <span className="text-red-400 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <input
            type="email"
            {...register("email")}
            placeholder="Correo electrónico"
            className={`bg-[#1a1a1a] border rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-600 focus:border-blue-500"
            }`}
          />
          {errors.email && (
            <span className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <select
            {...register("role")}
            className={`bg-[#1a1a1a] border rounded px-4 py-2 text-white focus:outline-none ${
              errors.role
                ? "border-red-500 focus:border-red-500"
                : "border-gray-600 focus:border-blue-500"
            }`}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && (
            <span className="text-red-400 text-sm mt-1">
              {errors.role.message}
            </span>
          )}
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition flex items-center gap-2">
            <i className="fa-solid fa-check"></i>
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
