import axiosInstance from "./axiosInstance";

const roomService = {
    getAll: async (params) => {
        const response = await axiosInstance.get("/manager/rooms", { params });
        return response.data;
    },
    getDetail: async (id) => {
        const response = await axiosInstance.get(`/manager/rooms/${id}`);
        return response.data;
    },
    getStatuses: async () => {
        const response = await axiosInstance.get("/manager/rooms/statuses");
        return response.data;
    },
    getRoomTypes: async () => {
        const response = await axiosInstance.get("/manager/rooms/room-type");
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post("/manager/rooms", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(`/manager/rooms/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axiosInstance.delete(`/manager/rooms/${id}`);
        return response.data;
    },
    restore: async (id) => {
        const response = await axiosInstance.put(`/manager/rooms/${id}/restore`);
        return response.data;
    },
    updateFurnitures: async (id, furnitureIds) => {
        const response = await axiosInstance.put(`/manager/rooms/${id}/furnitures`, furnitureIds);
        return response.data;
    },
    uploadImage: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post(`/manager/rooms/${id}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
};

export default roomService;
