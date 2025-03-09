package com.meac.url_shortener.entities.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record UrlRequest(@NotBlank String url, @Min(0) long expiration) {
}
