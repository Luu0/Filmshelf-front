const UserRow = ({ user, index, onEdit, onDelete }) => (
  <tr
    key={user.id}
    className={`border-b border-gray-700 ${
      index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#1f1f1f]"
    } hover:bg-[#333333] transition`}>
    <td className="px-3 py-4 md:px-6 text-sm">{user.id}</td>
    <td className="px-3 py-4 md:px-6 text-sm font-medium">{user.name}</td>
    <td className="px-3 py-4 md:px-6 text-sm text-gray-400">{user.email}</td>
    <td className="px-3 py-4 md:px-6 text-sm">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          user.role.toLowerCase() === "admin"
            ? "bg-red-900 text-red-200"
            : "bg-blue-900 text-blue-200"
        }`}>
        {user.role}
      </span>
    </td>
    <td className="px-3 py-4 md:px-6 text-sm flex gap-2">
      <button
        onClick={() => onEdit(user)}
        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 md:px-3 rounded text-xs transition flex items-center gap-1"
        title="Editar">
        <i className="fa-solid fa-pen-to-square"></i>
        <span className="hidden md:inline ml-1">Editar</span>
      </button>
      <button
        onClick={() => onDelete(user.id)}
        className="bg-red-600 hover:bg-red-700 px-2 py-1 md:px-3 rounded text-xs transition flex items-center gap-1"
        title="Eliminar">
        <i className="fa-solid fa-trash"></i>
        <span className="hidden md:inline ml-1">Eliminar</span>
      </button>
    </td>
  </tr>
);

// componente principal de la tabla
export const UserTable = ({ users, onEdit, onDelete }) => (
  <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-700">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#1a1a1a] border-b border-gray-700">
          <tr>
            <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">
              ID
            </th>
            <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">
              Name
            </th>
            <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">
              Email
            </th>
            <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">
              Role
            </th>
            <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                (Aún no se han agregado usuarios)
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
    <div className="bg-[#1a1a1a] px-4 md:px-6 py-4 border-t border-gray-700">
      <p className="text-sm text-gray-400">
        Total de usuarios:{" "}
        <span className="font-bold text-white">{users.length}</span>
      </p>
    </div>
  </div>
);
