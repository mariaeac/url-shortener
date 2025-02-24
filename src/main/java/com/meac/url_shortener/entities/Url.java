package com.meac.url_shortener.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "urls")
public class Url {
    @Id
    private String id;

    private String originUrl;

    @Indexed(expireAfter = "0")
    private LocalDateTime expiresAt;

    private Long clickCount;

    public Url() {

    }

    public Url(String id, String originUrl, LocalDateTime expiresAt, Long clickCount) {
        this.id = id;
        this.originUrl = originUrl;
        this.expiresAt = expiresAt;
        this.clickCount = clickCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOriginUrl() {
        return originUrl;
    }

    public void setOriginUrl(String originUrl) {
        this.originUrl = originUrl;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Long getClickCount() {
        return clickCount;
    }

    public void setClickCount(Long clickCount) {
        this.clickCount = clickCount;
    }
}
