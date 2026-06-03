package com.group.hotel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = resolveUploadPath().toAbsolutePath().normalize().toString();
        registry.addResourceHandler("/RoomImages/**")
                .addResourceLocations(
                        "file:" + absolutePath + "/",
                        "classpath:/static/RoomImages/"
                );
    }

    private Path resolveUploadPath() {
        try {
            URL classpathRoot = WebMvcConfig.class.getResource("/");
            if (classpathRoot != null) {
                Path classesDir = Paths.get(classpathRoot.toURI());
                // target/classes -> target -> module root (booking_hotel_backend)
                return classesDir.getParent().getParent().resolve(uploadDir);
            }
        } catch (Exception ignored) {}
        return Paths.get(uploadDir);
    }
}
