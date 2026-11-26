package com.example.CollabPM.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        log.info("========== JWT FILTER START ==========");
        log.info("REQUEST URI: {}", request.getRequestURI());

        String authHeader =
                request.getHeader(SecurityConstants.HEADER_STRING);

        log.info("AUTH HEADER EXISTS: {}", authHeader != null);

        // No token
        if (authHeader == null ||
                !authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {

            log.info("NO VALID BEARER TOKEN");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        log.info("BEARER TOKEN FOUND");

        // Validate token
        boolean tokenValid = jwtService.isTokenValid(token);

        log.info("TOKEN VALID: {}", tokenValid);

        if (!tokenValid) {
            log.warn("JWT IS INVALID OR EXPIRED");

            filterChain.doFilter(request, response);
            return;
        }

        // Extract email
        String email;

        try {
            email = jwtService.extractEmail(token);
            log.info("JWT EMAIL: {}", email);

        } catch (Exception e) {
            log.error("FAILED TO EXTRACT EMAIL FROM JWT", e);

            SecurityContextHolder.clearContext();

            filterChain.doFilter(request, response);
            return;
        }

        // Set authentication
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            try {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                log.info("USER LOADED: {}", userDetails.getUsername());
                log.info("USER AUTHORITIES: {}",
                        userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);

                log.info("AUTHENTICATION SET SUCCESSFULLY");

                log.info("FINAL AUTHORITIES: {}",
                        SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getAuthorities());

            } catch (Exception e) {

                log.error(
                        "FAILED TO LOAD USER OR SET AUTHENTICATION FOR EMAIL: {}",
                        email,
                        e
                );

                SecurityContextHolder.clearContext();
            }
        }

        log.info(
                "SECURITY CONTEXT AUTHENTICATION: {}",
                SecurityContextHolder.getContext()
                        .getAuthentication()
        );

        log.info("========== JWT FILTER END ==========");

        filterChain.doFilter(request, response);
    }
}