import axiosInstance from "./axiosInstance";

const profileApi = {
    /**
     * Lấy thông tin hồ sơ của chính user đang đăng nhập (Dựa vào Token ở Header)
     * @returns {Promise<BaseResponse<ProfileResponse>>}
     */
    getMyProfile: () => {
        return axiosInstance.get("/profiles/me");
    },

    /**
     * Cập nhật thông tin hồ sơ (Hỗ trợ upload ảnh đại diện qua FormData)
     * @param {Object} updateData - Dữ liệu chữ từ Form (fullName, phone,...)
     * @param {File|null} avatarFile - Đối tượng File ảnh chọn từ thẻ <input type="file">
     * @returns {Promise<BaseResponse<ProfileResponse>>}
     */
    updateMyProfile: (updateData, avatarFile) => {
        const formData = new FormData();

        // 1. Đẩy toàn bộ các trường text dữ liệu vào FormData
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                formData.append(key, updateData[key]);
            }
        });

        // 2. Nếu người dùng có chọn ảnh mới, đẩy file ảnh vào đúng key "file" mà Backend yêu cầu
        if (avatarFile) {
            formData.append("file", avatarFile);
        }

        // 3. Bắn request PUT với header multipart/form-data
        return axiosInstance.put("/profiles/me", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default profileApi;