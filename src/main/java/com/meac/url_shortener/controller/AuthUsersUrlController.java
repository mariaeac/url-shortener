package com.meac.url_shortener.controller;

import com.meac.url_shortener.entities.dtos.ResponseUserDTO;
import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;
import com.meac.url_shortener.entities.dtos.UsersURLResponseDTO;
import com.meac.url_shortener.services.AuthUserUrlServices;
import com.meac.url_shortener.services.UserServices;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class AuthUsersUrlController {

    private final AuthUserUrlServices authUserUrlServices;
    private final UserServices userServices;


    public AuthUsersUrlController(AuthUserUrlServices authUserUrlServices, UserServices userServices) {
        this.authUserUrlServices = authUserUrlServices;
        this.userServices = userServices;
    }

    @PostMapping("/urls")
    public ResponseEntity<UrlResponse> shortenAuthUrl(@Valid @RequestBody UrlRequest urlRequest, HttpServletRequest request, @AuthenticationPrincipal Jwt jwtToken) {
        String userId = jwtToken.getSubject();
        UrlResponse response = authUserUrlServices.urlShortGenerate(urlRequest, request, UUID.fromString(userId));
        return ResponseEntity.ok(response);

    }

    @GetMapping("/urls")
    public ResponseEntity<List<UsersURLResponseDTO>> getUsersUrls(@AuthenticationPrincipal Jwt jwtToken) {
        String userId = jwtToken.getSubject();
        List<UsersURLResponseDTO> urls = authUserUrlServices.getUrlsFromUser(UUID.fromString(userId));

        return ResponseEntity.ok(urls);

    }

    @DeleteMapping("/urls/{urlId}")
    public ResponseEntity<?> deleteUrl(@PathVariable String urlId, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        authUserUrlServices.deleteUrlById(urlId, userId);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/info")
    public ResponseEntity<ResponseUserDTO> getUserInfo(@AuthenticationPrincipal Jwt jwtToken) {

        String userId = jwtToken.getSubject();
        ResponseUserDTO userDTO = userServices.getUserInfo(UUID.fromString(userId));

        return ResponseEntity.ok(userDTO);

    }


}
