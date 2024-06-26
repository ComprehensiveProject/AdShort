package com.project.as.service;

import com.project.as.config.GcsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    private GcsConfig gcsConfig;

    public String uploadImage(MultipartFile file) throws IOException {
        return gcsConfig.uploadFile(file);
    }
}

