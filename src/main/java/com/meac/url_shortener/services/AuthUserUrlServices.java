package com.meac.url_shortener.services;

import com.meac.url_shortener.entities.Url;
import com.meac.url_shortener.entities.User;
import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;
import com.meac.url_shortener.repository.UrlRepository;
import com.meac.url_shortener.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthUserUrlServices {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    public AuthUserUrlServices(UrlRepository urlRepository, UserRepository userRepository) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
    }

    public UrlResponse urlShortGenerate(UrlRequest urlRequest, HttpServletRequest httpServletRequest, JwtAuthenticationToken jwtToken) {

        String userId = jwtToken.getName();
        Optional<User> user = userRepository.findById(UUID.fromString(userId));
        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        RandomStringGenerator generator = new RandomStringGenerator.Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.LETTERS, CharacterPredicates.DIGITS)
                .build();

        String urlId;
        do {
            urlId = generator.generate(5, 10);
        } while (urlRepository.existsById(urlId));

        Url url = urlRepository.save(new Url(urlId, urlRequest.url(), LocalDateTime.now().plusMinutes(1), 0L, user.get().getId()));
        var redirectUrl = httpServletRequest.getRequestURL().toString().replace("urls", urlId);
        return new UrlResponse(redirectUrl, url.getClickCount());

    }

}
