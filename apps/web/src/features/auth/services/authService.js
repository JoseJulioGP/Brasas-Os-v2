const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: "1",
    rol_id: "1",
    nombre: "Admin",
    email: "admin@brasas.com",
    password_hash: "admin123",
    activo: true,
    ultimo_acceso: null,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    rol_id: "2",
    nombre: "Empleado",
    email: "empleado@brasas.com",
    password_hash: "empleado123",
    activo: true,
    ultimo_acceso: null,
    created_at: "2024-01-02T00:00:00Z",
  },
];

export const authService = {
  async login(email, password) {
    await delay(800);
    const user = mockUsers.find(
      (u) => u.email === email && u.password_hash === password
    );
    if (!user) {
      throw new Error("Credenciales inválidas");
    }
    if (!user.activo) {
      throw new Error("Usuario inactivo");
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async register(nombre, email, password) {
    await delay(800);
    const exists = mockUsers.find((u) => u.email === email);
    if (exists) {
      throw new Error("El correo ya está registrado");
    }
    const newUser = {
      id: crypto.randomUUID(),
      rol_id: "2",
      nombre,
      email,
      password_hash: password,
      activo: true,
      ultimo_acceso: null,
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async getCurrentUser() {
    await delay(300);
    const stored = localStorage.getItem("brasas_user");
    if (!stored) return null;
    return JSON.parse(stored);
  },
};