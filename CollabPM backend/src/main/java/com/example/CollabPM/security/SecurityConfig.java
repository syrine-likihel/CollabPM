package com.example.CollabPM.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
     private final JwtAuthentificationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // CORS
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource())
                )

                // JWT
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Authentication errors
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                (AuthenticationEntryPoint) jwtAuthenticationEntryPoint
                        )
                )

                // Authorization
                .authorizeHttpRequests(auth -> auth

                // AUTH
                .requestMatchers("/api/auth/**")
                .permitAll()

                .requestMatchers("/error")
                .permitAll()

                // DASHBOARD
                .requestMatchers("/api/dashboard/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER",
                        "MEMBER"
                )

                // PROJECTS
                // Everyone authenticated can consult projects
                .requestMatchers(HttpMethod.GET, "/api/projects/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER",
                        "MEMBER"
                )

                // Only ADMIN can create projects
                .requestMatchers(HttpMethod.POST, "/api/projects/**")
                .hasRole("ADMIN")

                // ADMIN + PM can modify projects
                .requestMatchers(HttpMethod.PUT, "/api/projects/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER"
                )

                // Only ADMIN can delete projects
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**")
                .hasRole("ADMIN")

                // TASKS
                // Everyone can consult tasks
                .requestMatchers(HttpMethod.GET, "/api/tasks/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER",
                        "MEMBER"
                )

                // ADMIN + PM can create tasks
                .requestMatchers(HttpMethod.POST, "/api/tasks/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER"
                )

                // ADMIN + PM can modify tasks
                .requestMatchers(HttpMethod.PUT, "/api/tasks/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER"
                )

                // Status change
                // The detailed permission is checked inside TaskService
                .requestMatchers(HttpMethod.PATCH, "/api/tasks/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER",
                        "MEMBER"
                )

                // Only ADMIN can delete tasks
                .requestMatchers(HttpMethod.DELETE, "/api/tasks/**")
                .hasRole("ADMIN")

                // MEMBERS
                .requestMatchers("/api/members/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER"
                )


                // COMMENTS
                .requestMatchers("/api/comments/**")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER",
                        "MEMBER"
                )

                // USERS
                // ADMIN + PM can see available users
                .requestMatchers("/api/users/available")
                .hasAnyRole(
                        "ADMIN",
                        "PROJECT_MANAGER"
                )

                // Only ADMIN can manage all users
                .requestMatchers("/api/users/**")
                .hasRole("ADMIN")

                // DEFAULT
                .anyRequest()
                .authenticated()
                )

        // JWT filter
                .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
                List.of("http://localhost:4200")
        );

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        config.setAllowedHeaders(
                List.of("*")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // AUTHENTICATION MANAGER
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }
}