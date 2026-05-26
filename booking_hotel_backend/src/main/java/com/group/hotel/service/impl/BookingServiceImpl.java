package com.group.hotel.service.impl;

import com.group.hotel.common.response.PageResponse;
import com.group.hotel.dto.request.SearchRoomAvailableRequest;
import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.entity.Room;
import com.group.hotel.exception.RoomConflictException;
import com.group.hotel.mapper.RoomMapper;
import com.group.hotel.repository.ReviewRepository;
import com.group.hotel.repository.RoomImageRepository;
import com.group.hotel.repository.RoomRepository;
import com.group.hotel.service.BookingService;
import com.group.hotel.specification.RoomSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {
    private final RoomRepository roomRepository;
    private final RoomImageRepository roomImageRepository;
    private final ReviewRepository reviewRepository;
    private final RoomMapper roomMapper;

    public BookingServiceImpl(RoomRepository roomRepository,
                              RoomImageRepository roomImageRepository,
                              ReviewRepository reviewRepository,
                              RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.roomImageRepository = roomImageRepository;
        this.reviewRepository = reviewRepository;
        this.roomMapper = roomMapper;
    }

    @Override
    public PageResponse<RoomAvailableResponse> searchAvailableRooms(SearchRoomAvailableRequest request, Pageable pageable) {
        validateSearchRoomAvailableRequest(request);

        Specification<Room> spec = RoomSpecification.searchAvailableRooms(request);
        var rooms = roomRepository.findAll(spec, pageable);
        Map<Long, Double> averageRatingByRoomId = getAverageRatingByRoomId(rooms.getContent());

        return PageResponse.of(rooms.map(room -> toAvailableResponse(room, averageRatingByRoomId)));
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
        RoomAvailableResponse response = roomMapper.toAvailableResponse(room);
        response.setStatus("AVAILABLE");
        response.setAverageRating(averageRatingByRoomId.getOrDefault(room.getId(), 0D));

        roomImageRepository.findByRoomTypeIdAndIsThumbnailTrue(room.getRoomType().getId())
                .ifPresent(image -> response.setImageUrl(image.getImageUrl()));

        return response;
    }
}
