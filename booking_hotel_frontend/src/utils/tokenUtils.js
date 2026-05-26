    const tokenUtils = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    },
    
    clearTokens: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
};

export default tokenUtils;