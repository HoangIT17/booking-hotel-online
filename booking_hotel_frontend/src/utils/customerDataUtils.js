export const getPageContent = (response) => response?.data?.content || [];

export const getResponseData = (response, fallback = null) =>
  response?.data ?? fallback;

export const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
};

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN");
};

export const getRoomImageUrl = (room) => {
  const image =
    room?.imageUrl ||
    room?.image ||
    room?.thumbnail ||
    room?.thumbnailUrl ||
    room?.roomImage ||
    room?.roomImageUrl ||
    room?.mainImageUrl ||
    room?.coverImageUrl ||
    room?.coverImage ||
    (Array.isArray(room?.images) && room.images[0]) ||
    (Array.isArray(room?.imageUrls) && room.imageUrls[0]) ||
    (Array.isArray(room?.imagesUrl) && room.imagesUrl[0]) ||
    (Array.isArray(room?.roomImages) && room.roomImages[0]) ||
    (Array.isArray(room?.roomImagesUrl) && room.roomImagesUrl[0]);

  if (!image) return "";
  if (typeof image === "string") {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `http://localhost:8080/api/v1/${image.replace(/^\/+/, "")}`;
  }

  if (typeof image === "object") {
    return (
      image.url ||
      image.imageUrl ||
      image.path ||
      image.fileUrl ||
      image.name ||
      ""
    );
  }

  return "";
};
