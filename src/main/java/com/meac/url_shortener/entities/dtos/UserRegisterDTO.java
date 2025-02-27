package com.meac.url_shortener.entities.dtos;

import jakarta.validation.constraints.NotBlank;

public record UserRegisterDTO(
        @NotBlank String username,
        @NotBlank String email,
        @NotBlank String password ){
}
