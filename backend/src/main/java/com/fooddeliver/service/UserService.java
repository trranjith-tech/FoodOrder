package com.fooddeliver.service;

import com.fooddeliver.dto.request.AddressRequest;
import com.fooddeliver.dto.request.UpdateProfileRequest;
import com.fooddeliver.dto.response.AddressResponse;
import com.fooddeliver.dto.response.UserResponse;
import com.fooddeliver.entity.Address;
import com.fooddeliver.entity.User;
import com.fooddeliver.exception.AppException;
import com.fooddeliver.repository.AddressRepository;
import com.fooddeliver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
            .phone(user.getPhone()).role(user.getRole().name()).verified(user.isVerified())
            .addresses(user.getAddresses().stream().map(this::mapToAddressResponse).collect(Collectors.toList())).build();
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return getProfile(email);
    }

    public List<AddressResponse> getAddresses(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        return addressRepository.findByUserId(user.getId()).stream().map(this::mapToAddressResponse).collect(Collectors.toList());
    }

    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        Address address = Address.builder().user(user).label(request.getLabel()).street(request.getStreet())
            .city(request.getCity()).state(request.getState()).pincode(request.getPincode()).isDefault(request.isDefault()).build();
        return mapToAddressResponse(addressRepository.save(address));
    }

    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
        Address address = addressRepository.findById(addressId).orElseThrow(() -> AppException.notFound("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) throw AppException.forbidden("Address doesn't belong to user");
        addressRepository.delete(address);
    }
    
    private AddressResponse mapToAddressResponse(Address a) {
        return AddressResponse.builder().id(a.getId()).label(a.getLabel()).street(a.getStreet())
            .city(a.getCity()).state(a.getState()).pincode(a.getPincode()).isDefault(a.isDefault()).build();
    }
}