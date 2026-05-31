package com.group.hotel.mapper;

import com.group.hotel.dto.request.ReviewCreateRequest;
import com.group.hotel.dto.request.ReviewReplyRequest;
import com.group.hotel.dto.response.ReviewResponse;
import com.group.hotel.entity.Review;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.profile.fullName", target = "customerName")
    @Mapping(source = "repliedBy.profile.fullName", target = "repliedByName")
    ReviewResponse toResponse(Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "staffReply", ignore = true)
    @Mapping(target = "repliedBy", ignore = true)
    @Mapping(target = "repliedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review fromCreate(ReviewCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "repliedBy", ignore = true)
    @Mapping(target = "repliedAt", ignore = true)
    void fromReply(ReviewReplyRequest request, @MappingTarget Review review);
}
