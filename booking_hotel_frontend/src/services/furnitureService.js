import axiosInstance from "./axiosInstance";

const furnitureService = {
    getAll: async (params) => {
        const response = await axiosInstance.get("/admin/furnitures", { params });
        return response.data;
    },

    getTypes: async () => {
        const response = await axiosInstance.get("/admin/furnitures/types");
        return response.data;
    },

    create: async (data) => {
        const response = await axiosInstance.post("/admin/furnitures", data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosInstance.put(`/admin/furnitures/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/admin/furnitures/${id}`);
        return response.data;
    },
};

export default furnitureService;
