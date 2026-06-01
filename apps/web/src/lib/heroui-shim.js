// Re-exporta todo de @heroui/react y agrega HeroUIProvider como alias
// para que el auto-import del linter no rompa la app
export * from "@heroui/react";

// HeroUIProvider no existe en v3 — lo exponemos como un passthrough
export const HeroUIProvider = ({ children }) => children;
