package com.pos.service;

import com.pos.dto.request.LoginRequest;
import com.pos.dto.request.RefreshTokenRequest;
import com.pos.dto.response.TokenResponse;
import com.pos.dto.response.UserResponse;

public interface AuthService {
    TokenResponse login(LoginRequest request);
    TokenResponse refreshToken(RefreshTokenRequest request);
    void logout(RefreshTokenRequest request);
    UserResponse getCurrentUser(String username);
}
