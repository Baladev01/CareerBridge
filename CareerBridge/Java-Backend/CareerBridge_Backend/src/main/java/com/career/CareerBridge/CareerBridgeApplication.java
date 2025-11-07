package com.career.CareerBridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableJpaRepositories
@ComponentScan(basePackages = {"com.career.CareerBridge.controller", 
        "com.career.CareerBridge.service", 
        "com.career.CareerBridge.repository",
        "com.career.CareerBridge.config"})
public class CareerBridgeApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(CareerBridgeApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(CareerBridgeApplication.class, args);
        
        System.out.println("Spring Boot .................!");
    }
    
}