import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for normalized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Shipment API calls
export const shipmentApi = {
  getAll: (params) => api.get("/shipments", { params }),
  getById: (id) => api.get(`/shipments/${id}`),
  track: (trackingId) => api.get(`/shipments/track/${trackingId}`),
  create: (data) => api.post("/shipments", data),
  updateStatus: (id, data) => api.patch(`/shipments/${id}/status`, data),
  delete: (id) => api.delete(`/shipments/${id}`),
  getStats: () => api.get("/shipments/stats"),
};

export default api;
