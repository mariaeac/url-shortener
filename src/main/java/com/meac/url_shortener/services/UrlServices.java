package com.meac.url_shortener.services;

import com.meac.url_shortener.entities.Url;
import com.meac.url_shortener.entities.dtos.UrlRequest;
import com.meac.url_shortener.entities.dtos.UrlResponse;
import com.meac.url_shortener.repository.UrlRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;


@Service
public class UrlServices {

    private final UrlRepository urlRepository;
    public UrlServices(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public UrlResponse urlShortenerGenerate(UrlRequest urlRequest, HttpServletRequest httpServletRequest) {

       String urlId;
        do {
            urlId = RandomStringUtils.randomAlphanumeric(5, 10);
        } while (urlRepository.existsById(urlId));

        urlRepository.save(new Url(urlId, urlRequest.url(), LocalDateTime.now().plusMinutes(1), 0L));

        var redirectUrl = httpServletRequest.getRequestURL().toString().replace("shorten-url", urlId);
        return new UrlResponse(redirectUrl);
    }

    public Url getOriginUrl(String  urlId) {
        Url url = urlRepository.findById(urlId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);
        return url;
    }

}
