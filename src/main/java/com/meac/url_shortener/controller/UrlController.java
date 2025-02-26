package com.meac.url_shortener.controller;

import com.meac.url_shortener.entities.Url;
import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;

import com.meac.url_shortener.services.UrlServices;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api")
public class UrlController {

    private final UrlServices urlServices;

    public UrlController(UrlServices urlServices) {
        this.urlServices = urlServices;
    }

    @PostMapping("/shorten-url")
    public ResponseEntity<UrlResponse> shortenUrl(@Valid @RequestBody UrlRequest urlRequest, HttpServletRequest request) {
        UrlResponse response = urlServices.urlShortenerGenerate(urlRequest, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Void> redirect(@PathVariable String id) {
        Url url = urlServices.getOriginUrl(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(url.getOriginUrl()));
        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

    @GetMapping("/{url}/clicks")
    public ResponseEntity<Long> clicks(@PathVariable String url) {
        Long clickCounter =   urlServices.getUrlClicks(url);
        return ResponseEntity.ok(clickCounter);
    }


}
