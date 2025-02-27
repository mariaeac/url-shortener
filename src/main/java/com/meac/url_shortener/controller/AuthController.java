package com.meac.url_shortener.controller;

import com.meac.url_shortener.entities.dtos.UserLoginDTO;
import com.meac.url_shortener.entities.dtos.UserRegisterDTO;
import com.meac.url_shortener.services.UserServices;
import jakarta.validation.Valid;
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

    public AuthController(UserServices userServices) {
        this.userServices = userServices;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody UserRegisterDTO userRegister) {
        userServices.register(userRegister);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody UserLoginDTO userLogin) {

        userServices.login(userLogin);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();

    }
}
