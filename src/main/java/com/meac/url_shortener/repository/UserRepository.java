package com.meac.url_shortener.repository;

import com.meac.url_shortener.entities.Url;
import com.meac.url_shortener.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {
}
