package com.meac.url_shortener.entities.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record UsersURLResponseDTO(String originUrl, String shortUrl, LocalDateTime expiresAt, Long clicksCount) {
}
