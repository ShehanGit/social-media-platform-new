package com.socialmedia.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = storageProperties.getUploadDir();
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Convert to URL format and ensure proper separators
        String resourceLocation = uploadPath.toUri().toString();

        System.out.println("Media files will be served from: " + resourceLocation);

        registry.addResourceHandler("/media/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(0); // Disable cache during development
    }
}