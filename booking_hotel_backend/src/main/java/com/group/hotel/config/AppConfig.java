package com.group.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    // Khai báo RestTemplate để Spring Boot tiêm (Autowired) vào GeminiService
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}