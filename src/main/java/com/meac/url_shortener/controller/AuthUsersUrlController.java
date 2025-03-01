package com.meac.url_shortener.controller;

import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;
import com.meac.url_shortener.services.AuthUserUrlServices;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class AuthUsersUrlController {

    private final AuthUserUrlServices authUserUrlServices;

    public AuthUsersUrlController(AuthUserUrlServices authUserUrlServices) {
        this.authUserUrlServices = authUserUrlServices;
    }

    @PostMapping("/urls")
    public ResponseEntity<UrlResponse> shortenAuthUrl(@Valid @RequestBody UrlRequest urlRequest, HttpServletRequest request, JwtAuthenticationToken jwtToken) {

        UrlResponse response = authUserUrlServices.urlShortGenerate(urlRequest, request, jwtToken);
        return ResponseEntity.ok(response);

    }


}
