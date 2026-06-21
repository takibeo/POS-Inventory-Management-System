package com.pos.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Token làm mới không được để trống") String refreshToken
) {
}
