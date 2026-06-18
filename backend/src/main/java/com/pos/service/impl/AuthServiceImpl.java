package com.pos.service.impl;

import com.pos.dto.request.LoginRequest;
import com.pos.dto.request.RefreshTokenRequest;
import com.pos.dto.response.TokenResponse;
import com.pos.dto.response.UserResponse;
import com.pos.entity.RefreshToken;
import com.pos.entity.User;
import com.pos.mapper.UserMapper;
import com.pos.repository.UserRepository;
import com.pos.service.AuthService;
import com.pos.service.RefreshTokenService;
import com.pos.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        var roles = user.getRoles().stream().map(r -> "ROLE_" + r.getName()).toList();
        String token = jwtUtil.generateToken(user.getUsername(), roles);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new TokenResponse(token, refreshToken.getToken(), "Bearer", jwtUtil.getExpirationMs());
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken validRefreshToken = refreshTokenService.verifyRefreshToken(request.refreshToken());
        var roles = validRefreshToken.getUser().getRoles().stream().map(r -> "ROLE_" + r.getName()).toList();
        String token = jwtUtil.generateToken(validRefreshToken.getUser().getUsername(), roles);
        refreshTokenService.revokeRefreshToken(request.refreshToken());
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(validRefreshToken.getUser());

        return new TokenResponse(token, newRefreshToken.getToken(), "Bearer", jwtUtil.getExpirationMs());
    }

    @Override
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.revokeRefreshToken(request.refreshToken());
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toResponse(user);
    }
}
