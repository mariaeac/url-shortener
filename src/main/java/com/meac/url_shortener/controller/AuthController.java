package com.meac.url_shortener.controller;

import com.meac.url_shortener.entities.dtos.*;
import com.meac.url_shortener.services.UserServices;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private UserServices userServices;

    @Value("${jwt.expiration.time}")
    private Long tokenExpirationTime;

    public AuthController(UserServices userServices) {
        this.userServices = userServices;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody UserRegisterDTO userRegister) {
        userServices.register(userRegister);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody UserLoginDTO userLogin, HttpServletResponse response) {
        TokenResponseDTO DTOResponse = userServices.login(userLogin);


        // cookie HTTPOnly e secure
        Cookie jwtCookie = new Cookie("JWT", DTOResponse.jwtToken());
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(Math.toIntExact(tokenExpirationTime));
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        response.addCookie(jwtCookie)

        return ResponseEntity.status(HttpStatus.OK).body(DTOResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("JWT", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        response.addCookie(cookie);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
