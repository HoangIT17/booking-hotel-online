export const getPageContent = (response) => response?.data?.content || [];

export const getResponseData = (response, fallback = null) =>
  response?.data ?? fallback;

const pickImageSource = (source) => {
  if (!source) return "";
  if (typeof source === "string") return source;
  if (Array.isArray(source)) {
    return source.map(pickImageSource).find(Boolean) || "";
  }
  if (typeof source === "object") {
    return (
      pickImageSource(source.imageUrl) ||
      pickImageSource(source.imagesUrl) ||
      pickImageSource(source.url) ||
      pickImageSource(source.path) ||
      pickImageSource(source.filePath) ||
      pickImageSource(source.name)
    );
  }
  return "";
};

export const getRoomImageUrl = (room = {}) => {
  const rawSource = pickImageSource([
    room.imageUrl,
    room.imagesUrl,
    room.thumbnailUrl,
    room.thumbnail,
    room.image,
    room.images,
    room.roomImages,
  ]);

  const imageSource = rawSource.trim().replaceAll("\\", "/");
  if (!imageSource) return "";
  if (/^https?:\/\//i.test(imageSource)) return imageSource;

  const normalizedSource =
    imageSource.startsWith("/") ||
    imageSource.startsWith("RoomImages/") ||
    imageSource.startsWith("uploads/")
      ? imageSource
      : `/RoomImages/${imageSource}`;

  return toAbsoluteAssetUrl(normalizedSource);
};

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
