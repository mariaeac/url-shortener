package com.meac.url_shortener.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.List;
import java.util.UUID;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
                new UUIDToStringConverter()
        ));
    }

    public static class UUIDToStringConverter implements Converter<UUID, String> {
        @Override
        public String convert(UUID source) {
            return source != null ? source.toString() : null;
        }
    }


}