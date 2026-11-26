package com.example.CollabPM.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import org.springframework.security.core.AuthenticationException; 
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthentificationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> body = new HashMap<>();
        body.put("status", 401);
        body.put("message", "Unauthorized: " + authException.getMessage());

        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
