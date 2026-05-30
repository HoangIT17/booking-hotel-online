package com.group.hotel.mapper;

import com.group.hotel.dto.request.BookingCreateRequest;
import com.group.hotel.dto.request.BookingUpdateRequest;
import com.group.hotel.dto.response.BookingCreateResponse;
import com.group.hotel.dto.response.BookingUpdateResponse;
import com.group.hotel.dto.response.RoomAvailableResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.Room;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "id", target = "roomId")
    @Mapping(source = "maxPeople", target = "capacity")
    RoomAvailableResponse toAvailableResponse(Room room);

    @Mapping(source = "checkIn", target = "checkInDate")
    @Mapping(source = "checkOut", target = "checkOutDate")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "voucher", ignore = true)
    @Mapping(target = "numNights", ignore = true)
    @Mapping(target = "extraCharge", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "payment", ignore = true)
    Booking fromCreateRequest(BookingCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "checkIn", target = "checkInDate")
    @Mapping(source = "checkOut", target = "checkOutDate")
    @Mapping(source = "bookingStatus", target = "status")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "voucher", ignore = true)
    @Mapping(target = "numNights", ignore = true)
    @Mapping(target = "numGuests", ignore = true)
    @Mapping(target = "extraCharge", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "payment", ignore = true)
    void updateBookingFromRequest(BookingUpdateRequest request, @MappingTarget Booking booking);

    @Mapping(source = "id", target = "bookingId")
    @Mapping(target = "message", ignore = true)
    BookingUpdateResponse toUpdateResponse(Booking booking);

    @Mapping(source = "id", target = "bookingId")
    @Mapping(target = "message", ignore = true)
    BookingCreateResponse toCreateResponse(Booking booking);
}
