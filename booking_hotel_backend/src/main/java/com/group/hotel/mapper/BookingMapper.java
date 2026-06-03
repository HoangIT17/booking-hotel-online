package com.group.hotel.mapper;

import com.group.hotel.dto.request.booking.BookingCreateRequest;
import com.group.hotel.dto.request.booking.BookingUpdateRequest;
import com.group.hotel.dto.response.booking.BookingCreateResponse;
import com.group.hotel.dto.response.booking.BookingSearchCustomerResponse;
import com.group.hotel.dto.response.booking.BookingSearchSystemResponse;
import com.group.hotel.dto.response.booking.BookingUpdateResponse;
import com.group.hotel.dto.response.room.CustomerRoomDetailResponse;
import com.group.hotel.dto.response.room.RoomAvailableResponse;
import com.group.hotel.entity.Booking;
import com.group.hotel.entity.BookingDetail;
import com.group.hotel.entity.Furniture;
import com.group.hotel.entity.Review;
import com.group.hotel.entity.Room;
import org.mapstruct.BeanMapping;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "id", target = "roomId")
    @Mapping(source = "roomNumber", target = "roomNumber")
    @Mapping(source = "roomType", target = "roomType")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "maxPeople", target = "capacity")
    @Mapping(source = "imageUrl", target = "imageUrl")
    @Mapping(target = "status", constant = "AVAILABLE")
    @Mapping(target = "averageRating", ignore = true)
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
    @Mapping(target = "paymentDate", ignore = true)
    Booking createBookingRequest(BookingCreateRequest request);

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
    @Mapping(target = "paymentDate", ignore = true)
    void updateBookingFromRequest(BookingUpdateRequest request, @MappingTarget Booking booking);

    @Mapping(source = "id", target = "bookingId")
    @Mapping(target = "message", ignore = true)
    BookingUpdateResponse toUpdateResponse(Booking booking);

    @Mapping(source = "id", target = "bookingId")
    @Mapping(target = "message", ignore = true)
    BookingCreateResponse toCreateResponse(Booking booking);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "roomId", source = "bookingDetail.room.id")
    @Mapping(target = "roomNumber", source = "bookingDetail.room.roomNumber")
    @Mapping(target = "roomType", source = "bookingDetail.room.roomType")
    @Mapping(target = "fullName", source = "booking.customer.profile.fullName", defaultValue = "")
    @Mapping(target = "email", source = "booking.customer.email", defaultValue = "")
    @Mapping(target = "phone", source = "booking.customer.profile.phone", defaultValue = "")
    @Mapping(target = "checkInDate", source = "booking.checkInDate")
    @Mapping(target = "checkOutDate", source = "booking.checkOutDate")
    @Mapping(target = "numNights", source = "booking.numNights")
    @Mapping(target = "numGuests", source = "booking.numGuests")
    @Mapping(target = "totalPrice", source = "booking.totalPrice")
    @Mapping(target = "bookingStatus", source = "booking.status")
    @Mapping(target = "paymentMethod", source = "booking.paymentMethod")
    @Mapping(target = "paymentDate", source = "booking.paymentDate")
    @Mapping(target = "createdAt", source = "booking.createdAt")
    @Mapping(target = "updatedAt", source = "booking.updatedAt")
    BookingSearchSystemResponse toSystemSearchResponse(
            Booking booking,
            BookingDetail bookingDetail
    );

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "roomId", source = "bookingDetail.room.id")
    @Mapping(target = "roomNumber", source = "bookingDetail.room.roomNumber")
    @Mapping(target = "roomType", source = "bookingDetail.room.roomType")
    @Mapping(target = "fullName", source = "booking.customer.profile.fullName", defaultValue = "")
    @Mapping(target = "email", source = "booking.customer.email", defaultValue = "")
    @Mapping(target = "phone", source = "booking.customer.profile.phone", defaultValue = "")
    @Mapping(target = "checkInDate", source = "booking.checkInDate")
    @Mapping(target = "checkOutDate", source = "booking.checkOutDate")
    @Mapping(target = "numNights", source = "booking.numNights")
    @Mapping(target = "numGuests", source = "booking.numGuests")
    @Mapping(target = "totalPrice", source = "booking.totalPrice")
    @Mapping(target = "bookingStatus", source = "booking.status")
    @Mapping(target = "paymentMethod", source = "booking.paymentMethod")
    @Mapping(target = "paymentDate", source = "booking.paymentDate")
    @Mapping(target = "createdAt", source = "booking.createdAt")
    @Mapping(target = "updatedAt", source = "booking.updatedAt")
    @Mapping(target = "hasReview", ignore = true)
    BookingSearchCustomerResponse toCustomerSearchResponse(
            Booking booking,
            BookingDetail bookingDetail
    );

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomNumber", source = "room.roomNumber")
    @Mapping(target = "roomType", source = "room.roomType")
    @Mapping(target = "price", source = "room.price")
    @Mapping(target = "capacity", source = "room.maxPeople")
    @Mapping(target = "description", source = "room.description")
    @Mapping(target = "status", source = "room.status")
    @Mapping(target = "imagesUrl", source = "room.imageUrl")
    @Mapping(target = "features", expression = "java(java.util.List.of())")
    @Mapping(target = "furniture", source = "furniture")
    @Mapping(target = "reviews", source = "reviews")
    CustomerRoomDetailResponse toCustomerRoomDetailResponse(
            Room room,
            List<CustomerRoomDetailResponse.FurnitureItem> furniture,
            List<CustomerRoomDetailResponse.ReviewItem> reviews
    );

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "name", source = "furnitureName")
    @Mapping(target = "quantity", constant = "1")
    CustomerRoomDetailResponse.FurnitureItem toFurnitureItem(Furniture furniture);

    @IterableMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    List<CustomerRoomDetailResponse.FurnitureItem> toFurnitureItemList(List<Furniture> furnitures);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "rating", source = "rating")
    @Mapping(target = "comment", source = "comment")
    CustomerRoomDetailResponse.ReviewItem toReviewItem(Review review);

    @IterableMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    List<CustomerRoomDetailResponse.ReviewItem> toReviewItemList(List<Review> reviews);
}
