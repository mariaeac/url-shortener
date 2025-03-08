package com.meac.url_shortener.repository;

import com.meac.url_shortener.entities.Url;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;
import java.util.UUID;


public interface UrlRepository extends MongoRepository<Url, String> {

    List<Url> findByUserId(UUID userId);
   
}
