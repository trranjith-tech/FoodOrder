package com.fooddeliver.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
@Component
public class JwtUtil {
    @Value("${app.jwt.secret}") private String jwtSecret;
    @Value("${app.jwt.expiration}") private long jwtExpiration;
    private SecretKey getSigningKey() { return Keys.hmacShaKeyFor(jwtSecret.getBytes()); }
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSigningKey()).compact();
    }
    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            Date expiration = Jwts.parser().verifyWith(getSigningKey()).build()
                .parseSignedClaims(token).getPayload().getExpiration();
            return username.equals(userDetails.getUsername()) && !expiration.before(new Date());
        } catch (Exception e) { return false; }
    }
}