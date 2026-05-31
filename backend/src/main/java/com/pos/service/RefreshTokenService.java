package com.pos.service;

import com.pos.entity.RefreshToken;
import com.pos.entity.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyRefreshToken(String token);
    void revokeRefreshToken(String token);
}
