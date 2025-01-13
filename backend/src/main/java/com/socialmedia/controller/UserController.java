package com.socialmedia.controller;

import com.socialmedia.dto.UserDto;
import com.socialmedia.service.UserService;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.convertToUserResponse(user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto.UserResponse> getUserById(@PathVariable Integer userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(userService.convertToUserResponse(user));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto.UserResponse> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(userService.convertToUserResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto.UserResponse> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDto.UpdateRequest updateRequest
    ) {
        User updatedUser = userService.updateUser(userDetails.getUsername(), updateRequest);
        return ResponseEntity.ok(userService.convertToUserResponse(updatedUser));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserDto.UserResponse>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> users = userService.searchUsers(query, pageRequest);
        Page<UserDto.UserResponse> response = users.map(userService::convertToUserResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Long>> getUserStats(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getUserStats(userId));
    }

    @PostMapping("/me/profile-picture")
    public ResponseEntity<Map<String, String>> updateProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) {
        // Handle file upload logic here
        // For this example, we'll just use a dummy URL
        String pictureUrl = "/uploads/profile-pictures/dummy.jpg";
        userService.updateProfilePicture(userDetails.getUsername(), pictureUrl);
        return ResponseEntity.ok(Map.of("pictureUrl", pictureUrl));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteUser(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}