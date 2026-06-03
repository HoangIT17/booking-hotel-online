import axiosInstance from "./axiosInstance";

const roomService = {
    getAll: async (params) => {
        const response = await axiosInstance.get("/rooms", { params });
        return response.data;
    },
    getDetail: async (id) => {
        const response = await axiosInstance.get(`/rooms/${id}`);
        return response.data;
    },
    getStatuses: async () => {
        const response = await axiosInstance.get("/rooms/statuses");
        return response.data;
    },
    getRoomTypes: async () => {
        const response = await axiosInstance.get("/rooms/room-type");
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post("/rooms", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/rooms/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/rooms/${id}`);
        return response.data;
    },
    restore: async (id) => {
        const response = await axiosInstance.put(`/rooms/${id}/restore`);
        return response.data;
    },
    updateFurnitures: async (id, furnitureIds) => {
        const response = await axiosInstance.put(`/rooms/${id}/furnitures`, furnitureIds);
        return response.data;
    },
    uploadImage: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post(`/rooms/${id}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
};

export default roomService;
