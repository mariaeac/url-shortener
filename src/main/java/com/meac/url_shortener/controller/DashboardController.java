package com.meac.url_shortener.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class DashboardController {

    @GetMapping("/dashboard")
    public void redirectToDashboard(HttpServletResponse response) throws IOException {
        response.sendRedirect("/dashboard.html");
    }

}
