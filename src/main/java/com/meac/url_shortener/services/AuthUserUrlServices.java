package com.meac.url_shortener.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.meac.url_shortener.entities.Url;
import com.meac.url_shortener.entities.User;
import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;
import com.meac.url_shortener.entities.dtos.UsersURLResponseDTO;
import com.meac.url_shortener.repository.UrlRepository;
import com.meac.url_shortener.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthUserUrlServices {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    public AuthUserUrlServices(UrlRepository urlRepository, UserRepository userRepository) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
    }

    public UrlResponse urlShortGenerate(UrlRequest urlRequest, HttpServletRequest httpServletRequest, UUID userId) {

        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        RandomStringGenerator generator = new RandomStringGenerator.Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.LETTERS, CharacterPredicates.DIGITS)
                .build();

        String urlId;
        do {
            urlId = generator.generate(5, 10);
        } while (urlRepository.existsById(urlId));


        LocalDateTime expirationTime = urlRequest.expiration() > 0 ? LocalDateTime.now().plusSeconds(urlRequest.expiration()) : LocalDateTime.now().plusYears(100);

        Url url = urlRepository.save(new Url(urlId, urlRequest.url(), expirationTime, 0L, user.get().getId()));

        String baseUrl = httpServletRequest.getRequestURL().toString().replace(httpServletRequest.getRequestURI(), "");

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }


        String redirectUrl = baseUrl + "api/" + urlId;
        return new UrlResponse(redirectUrl, url.getClickCount());

    }

    public List<UsersURLResponseDTO> getUrlsFromUser(UUID userId) {
        List<Url> urls = urlRepository.findByUserId(userId);

        if (urls.isEmpty()) {
            return null;
        }

        for (Url url : urls) {
            String urlId = url.getId();
            String shortUrlPath = "http://localhost:9090/api/" + urlId;
            url.setId(shortUrlPath);
        }

        List<UsersURLResponseDTO> response = urls.stream()
                .map(url -> new UsersURLResponseDTO(url.getOriginUrl(), url.getId(), url.getExpiresAt(), url.getClickCount())).toList();

        return response;

    }

    public void deleteUrlById(String urlId, UUID userId) {

        Optional<Url> url = urlRepository.findById(urlId);
        
        if (url.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "URL não encontrada");
        }

        if (!url.get().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para apagar esta URL");
        }

        urlRepository.deleteById(urlId);
    }

}
