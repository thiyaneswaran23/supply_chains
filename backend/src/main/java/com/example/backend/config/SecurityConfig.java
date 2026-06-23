package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Constructor Dependency Injection
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Explicitly hook the robust custom CORS configuration bean defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable Cross-Site Request Forgery blocks for token-based stateless operations
                .csrf(csrf -> csrf.disable())

                // 3. Set standard session creation policy guidelines to stateless tracking rules
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Role-Based Access Control matrix paths
                // Inside your SecurityFilterChain method:
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/inventories/**").hasAnyRole("SUPPLY_CHAIN_MANAGER", "WAREHOUSE_SUPERVISOR")
                        .requestMatchers(HttpMethod.PUT, "/api/inventories/**").hasRole("WAREHOUSE_SUPERVISOR")
                        .requestMatchers(HttpMethod.POST, "/api/shipments").hasRole("SUPPLY_CHAIN_MANAGER")

                        .requestMatchers("/api/shipments/deliver/**").hasAnyRole("SUPPLY_CHAIN_MANAGER", "WAREHOUSE_SUPERVISOR")
                        .requestMatchers("/api/shipments/**").hasAnyRole("SUPPLY_CHAIN_MANAGER", "WAREHOUSE_SUPERVISOR")

                        // 🟢 ADD THIS LINE: Allows both roles to access the POST route for delay scoring
                        .requestMatchers(HttpMethod.POST, "/api/analytics/predict-delay/**").hasAnyRole("SUPPLY_CHAIN_MANAGER", "WAREHOUSE_SUPERVISOR")

                        .requestMatchers("/api/analytics/**").hasRole("SUPPLY_CHAIN_MANAGER")
                        .anyRequest().authenticated()
                )

                // 5. Inject custom state decryption logic pipeline before standard authorization sweeps
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Explicit cross-origin handling source to dissolve preflight precheck network exceptions
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Expressly allow React Vite local dev server port
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply globally to all Spring backend controllers
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Cryptographic multi-round salting algorithm
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}