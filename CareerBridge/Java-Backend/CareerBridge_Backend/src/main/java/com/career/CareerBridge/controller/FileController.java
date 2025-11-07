package com.career.CareerBridge.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @GetMapping("/personal-documents/{filename:.+}")
    public ResponseEntity<Resource> servePersonalDocument(@PathVariable String filename) {
        try {
            // Resolve the file path
            Path filePath = Paths.get("uploads/personal-documents").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            // Check if file exists and is readable
            if (resource.exists() && resource.isReadable()) {
                // Determine content type dynamically
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Determine content type based on file extension
     */
    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".pdf")) {
            return "application/pdf";
        } else {
            return "application/octet-stream";
        }
    }
    
    /**
     * Serve profile photos with caching headers for better performance
     */
    @GetMapping("/profile-photos/{filename:.+}")
    public ResponseEntity<Resource> serveProfilePhoto(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/personal-documents").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400") // Cache for 1 day
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}