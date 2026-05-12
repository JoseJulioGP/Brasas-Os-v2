import { useEffect, useState } from "react";
import { useUsersStore } from "../stores/useUsersStore";
import { FaUserPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ROLES = [
  { value: 1, label: "ADMIN" },
  { value: 2, label: "JEFE" },
  { value: 3, label: "EMPLEADO" }
];

const initialFormData = {
  nombre: "",
  email: "",
  password: "",
  rol_id: 3
};

export const UsersPage = () => {
  const { 
    users, 
    isLoading, 
    error, 
    fetchUsers, 
    createUser, 
    updateUser, 
    deactivateUser, 
    clearError 
  } = useUsersStore();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        nombre: user.nombre, 
        email: user.email, 
        password: "", 
        rol_id: user.rol_id || 3 
      });
    } else {
      setEditingUser(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { 
          nombre: formData.nombre, 
          email: formData.email, 
          rol_id: formData.rol_id 
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateUser(editingUser.id, updateData);
      } else {
        await createUser(formData);
      }
      handleCloseModal();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de desactivar este usuario?")) {
      await deactivateUser(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          <FaUserPlus /> Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="bg-[#0c0c0c] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left text-white/60 text-sm font-medium">Nombre</th>
                <th className="p-4 text-left text-white/60 text-sm font-medium">Email</th>
                <th className="p-4 text-left text-white/60 text-sm font-medium">Rol</th>
                <th className="p-4 text-left text-white/60 text-sm font-medium">Estado</th>
                <th className="p-4 text-left text-white/60 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/40">
                    {isLoading ? "Cargando..." : "No hay usuarios registrados"}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-white">{user.nombre}</td>
                    <td className="p-4 text-white/70">{user.email}</td>
                    <td className="p-4 text-white/70">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                        {user.rol_nombre || "EMPLEADO"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.activo 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)} 
                          className="p-2 text-orange-400 hover:bg-orange-500/10 rounded transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Desactivar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] p-6 rounded-xl border border-white/10 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button onClick={handleCloseModal} className="text-white/40 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Contraseña {editingUser && "(opcional)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                  required={!editingUser}
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">Rol</label>
                <select
                  value={formData.rol_id}
                  onChange={(e) => setFormData({ ...formData, rol_id: parseInt(e.target.value) })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500/50 focus:outline-none"
                >
                  {ROLES.map((rol) => (
                    <option key={rol.value} value={rol.value} className="bg-[#0c0c0c]">
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Guardando..." : editingUser ? "Guardar" : "Crear"}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};