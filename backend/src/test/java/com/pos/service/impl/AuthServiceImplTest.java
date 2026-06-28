package com.pos.service.impl;

import com.pos.dto.request.LoginRequest;
import com.pos.entity.RefreshToken;
import com.pos.entity.User;
import com.pos.repository.UserRepository;
import com.pos.service.RefreshTokenService;
import com.pos.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private RefreshTokenService refreshTokenService;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil, refreshTokenService);
    }

    @Test
    void loginSuccess() {
        var user = new User();
        user.setUsername("alice");
        user.setPassword("encoded");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "encoded")).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), anyList())).thenReturn("token");
        var rt = new RefreshToken(); rt.setToken("rt"); when(refreshTokenService.createRefreshToken(user)).thenReturn(rt);

        var req = new LoginRequest("alice", "pass");
        var resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("token", resp.accessToken());
        verify(refreshTokenService).createRefreshToken(user);
    }

    @Test
    void loginInvalidPasswordThrows() {
        var user = new User(); user.setUsername("bob"); user.setPassword("encoded");
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

    }
}

