package com.meac.url_shortener.services;

import com.meac.url_shortener.entities.User;
import com.meac.url_shortener.entities.dtos.TokenResponseDTO;
import com.meac.url_shortener.entities.dtos.UserLoginDTO;
import com.meac.url_shortener.entities.dtos.UserRegisterDTO;
import com.meac.url_shortener.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserServices {

    @Value("${jwt.expiration.time}")
    private Long tokenExpirationTime;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bcryptPasswordEncoder;
    private final JwtEncoder jwtEncoder;

    public UserServices(UserRepository userRepository, BCryptPasswordEncoder bcryptPasswordEncoder, JwtEncoder jwtEncoder) {
        this.userRepository = userRepository;
        this.bcryptPasswordEncoder = bcryptPasswordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public void register(UserRegisterDTO userRegister) {
        User user = new User(UUID.randomUUID(), userRegister.username(),userRegister.email(), bcryptPasswordEncoder.encode(userRegister.password()));
        userRepository.save(user);
    }

    public TokenResponseDTO login(@Valid UserLoginDTO userLogin) {
        User user = userRepository.findByEmail(userLogin.email()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!validateLoginCredentials(userLogin, user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String jwtToken = generateJwtToken(user);
        return new TokenResponseDTO(jwtToken);
    }

    public Boolean validateLoginCredentials(UserLoginDTO userLogin, User user) {
        return bcryptPasswordEncoder.matches(userLogin.password(), user.getPassword());
    }

    public String generateJwtToken(User user) {
        Instant now = Instant.now();
        var claims = JwtClaimsSet.builder().issuer("shorten_url-backend")
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(tokenExpirationTime))
                .claim("username", user.getUsername())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
