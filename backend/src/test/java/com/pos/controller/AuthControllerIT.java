package com.pos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pos.dto.request.LoginRequest;
import com.pos.dto.request.RefreshTokenRequest;
import com.pos.dto.response.TokenResponse;
import com.pos.dto.response.UserResponse;
import com.pos.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthControllerIT {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @org.mockito.Mock private AuthService authService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        AuthController controller = new AuthController(authService);
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(controller).build();
    }

    @org.junit.jupiter.api.Test
    void login_returnsToken() throws Exception {
        LoginRequest req = new LoginRequest("alice", "secret");
        TokenResponse resp = new TokenResponse("jwt","rt","Bearer",3600);
        when(authService.login(org.mockito.ArgumentMatchers.any())).thenReturn(resp);

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt"));
    }

    @org.junit.jupiter.api.Test
    void me_returnsUser() throws Exception {
        UserResponse u = new UserResponse(); // default constructor
        u.setUsername("alice");
        when(authService.getCurrentUser(org.mockito.ArgumentMatchers.anyString())).thenReturn(u);

        mockMvc.perform(get("/api/auth/me").principal((Principal) () -> "alice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @org.junit.jupiter.api.Test
    void refresh_returnsToken() throws Exception {
        RefreshTokenRequest req = new RefreshTokenRequest("rt");
        TokenResponse resp = new TokenResponse("jwt2","rt2","Bearer",3600);
        when(authService.refreshToken(org.mockito.ArgumentMatchers.any())).thenReturn(resp);

        mockMvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt2"));
    }
}
