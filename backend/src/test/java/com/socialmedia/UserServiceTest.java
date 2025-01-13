package com.socialmedia;

import com.socialmedia.dto.UserDto;
import com.socialmedia.service.UserService;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.hamcrest.Matchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetUserByEmail() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        User result = userService.getUserByEmail(email);

        // Assert
        assertEquals(email, result.getEmail());
    }

    @Test
    void testUpdateUser() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto.UpdateRequest updateRequest = new UserDto.UpdateRequest();
        updateRequest.setFirstname("Updated");

        // Act
        User result = userService.updateUser(email, updateRequest);

        // Assert
        assertEquals("Updated", result.getFirstname());
    }
}