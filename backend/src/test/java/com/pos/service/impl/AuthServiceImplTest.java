package com.pos.service.impl;

import com.pos.dto.request.LoginRequest;
import com.pos.entity.RefreshToken;
import com.pos.entity.Role;
import com.pos.entity.User;
import com.pos.repository.UserRepository;
import com.pos.service.RefreshTokenService;
import com.pos.service.impl.AuthServiceImpl;
import com.pos.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private RefreshTokenService refreshTokenService;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = mock(JwtUtil.class);
        refreshTokenService = mock(RefreshTokenService.class);

        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil, refreshTokenService);
    }

    @Test
    void login_success_returnsTokens() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("encoded-pass");
        Role r = new Role();
        r.setName("ADMIN");
        user.setRoles(Set.of(r));

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "encoded-pass")).thenReturn(true);
        when(jwtUtil.generateToken(eq("alice"), ArgumentMatchers.anyCollection())).thenReturn("jwt-token");

        RefreshToken rt = new RefreshToken();
        rt.setToken("refresh-token");
        when(refreshTokenService.createRefreshToken(user)).thenReturn(rt);
        when(jwtUtil.getExpirationMs()).thenReturn(3600000L);

        var response = authService.login(new LoginRequest("alice", "secret"));

        assertNotNull(response);
        assertEquals("jwt-token", response.accessToken());
        assertEquals("refresh-token", response.refreshToken());
    }

    @Test
    void login_invalidPassword_throws() {
        User user = new User();
        user.setUsername("bob");
        user.setPassword("encoded");

        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(new LoginRequest("bob", "wrong")));
    }
}
