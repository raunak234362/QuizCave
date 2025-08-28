// Environment-based configuration constants
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8010/api/v1";
export const IMG_URL = import.meta.env.VITE_IMG_URL || "http://localhost:5551";

// Export the axios instance as well for convenience
export { default as apiInstance } from "./api";
