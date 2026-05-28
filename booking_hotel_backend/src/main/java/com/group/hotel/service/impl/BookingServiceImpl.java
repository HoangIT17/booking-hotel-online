package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.CustomerRoomDetailResponse;
import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.entity.Room;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.exception.RoomNotFoundException;
import com.group.hotel.mapper.BookingMapper;
import com.group.hotel.repository.ReviewRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.service.BookingService;
import com.group.hotel.specification.RoomSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;
    private final BookingMapper bookingMapper;

    @Override
    public PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable) {
        validateSearchRoomAvailableRequest(request);

        Specification<Room> spec = RoomSpecification.searchAvailableRooms(request);
        var rooms = roomRepository.findAll(spec, pageable);
        Map<Long, Double> averageRatingByRoomId = getAverageRatingByRoomId(rooms.getContent());

        return PageResponse.of(rooms.map(room -> toAvailableResponse(room, averageRatingByRoomId)));
    }

    @Override
    public CustomerRoomDetailResponse getCustomerRoomDetail(Long roomId) {
        Room room = roomRepository.findByIdWithFurnitures(roomId)
                .filter(foundRoom -> !foundRoom.isDeleted())
                .orElseThrow(RoomNotFoundException::new);

        List<CustomerRoomDetailResponse.FurnitureItem> furniture = room.getFurnitures() == null
                ? List.of()
                : room.getFurnitures().stream()
                .map(item -> CustomerRoomDetailResponse.FurnitureItem.builder()
                        .name(item.getFurnitureName())
                        .quantity(1)
                        .build())
                .toList();

        List<CustomerRoomDetailResponse.ReviewItem> reviews = reviewRepository.findByRoomId(roomId)
                .stream()
                .map(review -> CustomerRoomDetailResponse.ReviewItem.builder()
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .build())
                .toList();

        return CustomerRoomDetailResponse.builder()
                .roomId(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType() == null ? null : room.getRoomType().name())
                .price(room.getPrice())
                .capacity(room.getMaxPeople())
                .description(room.getDescription())
                .status("AVAILABLE")
                .imagesUrl(room.getImageUrl())
                .features(List.of())
                .furniture(furniture)
                .reviews(reviews)
                .build();
    }

    private void validateSearchRoomAvailableRequest(SearchRoomAvailableRequest request) {
        if (!request.isValidDateRange()) {
            throw new RoomConflictException("checkIn must be before checkOut");
        }
        if (request.getMinPrice() != null && request.getMaxPrice() != null
                && request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
            throw new RoomConflictException("minPrice must be less than or equal to maxPrice");
        }
    }

    private Map<Long, Double> getAverageRatingByRoomId(List<Room> rooms) {
        List<Long> roomIds = rooms.stream().map(Room::getId).toList();
        if (roomIds.isEmpty()) {
            return Map.of();
        }

        return reviewRepository.findAverageRatingsByRoomIds(roomIds)
                .stream()
                .collect(Collectors.toMap(
                        ReviewRepository.RoomAverageRatingProjection::getRoomId,
                        ReviewRepository.RoomAverageRatingProjection::getAverageRating));
    }

    private RoomAvailableResponse toAvailableResponse(Room room, Map<Long, Double> averageRatingByRoomId) {
        RoomAvailableResponse response = bookingMapper.toAvailableResponse(room);
        response.setStatus("AVAILABLE");
        response.setAverageRating(averageRatingByRoomId.getOrDefault(room.getId(), 0D));

        roomRepository.findImageUrlByRoomId(room.getId())
                .ifPresent(response::setImageUrl);
        return response;
    }
}
