import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { FaDrumstickBite, FaBoxOpen, FaFire, FaWineBottle, FaSeedling, FaCube } from "react-icons/fa";

export const categorias = [
  { id: "carnes", label: "Carnes", icon: FaDrumstickBite, color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { id: "empaques", label: "Empaques", icon: FaBoxOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "salsas", label: "Salsas y Condimentos", icon: FaSeedling, color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { id: "carbon", label: "Carbón y Leña", icon: FaFire, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { id: "bebidas", label: "Bebidas", icon: FaWineBottle, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "varios", label: "Varios", icon: FaCube, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

export const categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c]));

export const getStockStatus = (item) => {
  const actual  = parseFloat(item.stock_actual  ?? item.cantidad  ?? 0);
  const minimo  = parseFloat(item.stock_minimo  ?? item.stockMinimo ?? 0);
  if (actual <= minimo)       return { color: "bg-red-500/10 text-red-400 border-red-500/20",    bar: "bg-red-500",    label: "Crítico", icon: FiAlertTriangle };
  if (actual <= minimo * 1.5) return { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", bar: "bg-yellow-500", label: "Bajo",    icon: FiAlertTriangle };
  return { color: "bg-green-500/10 text-green-400 border-green-500/20", bar: "bg-green-500", label: "OK", icon: FiCheckCircle };
};

export const getStockPercentage = (item) => {
  const actual = parseFloat(item.stock_actual ?? item.cantidad ?? 0);
  const minimo = parseFloat(item.stock_minimo ?? item.stockMinimo ?? 0);
  // El 100% de la barra es el mayor entre lo que hay actualmente y el doble del mínimo.
  // Así la barra refleja el stock real sin inventar un "máximo" fijo.
  const max = Math.max(actual, minimo * 2, 1);
  return Math.min((actual / max) * 100, 100);
};

export const formatFecha = (fecha) => {
  const date = new Date(fecha);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Hace minutos";
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffHours < 48) return "Ayer";
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};
