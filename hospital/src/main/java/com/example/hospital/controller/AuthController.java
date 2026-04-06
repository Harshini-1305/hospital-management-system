package com.example.hospital.controller;

import com.example.hospital.entity.User;
import com.example.hospital.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.example.hospital.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    public AuthController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;

    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }
@PostMapping("/login")
public AuthResponse login(@RequestBody User user) {
    User loggedUser = service.login(user.getEmail(), user.getPassword());
    String token = jwtUtil.generateToken(
            loggedUser.getEmail(),
            loggedUser.getRole().name()
    );
    return new AuthResponse(token, loggedUser.getRole().name(), loggedUser.getName(), loggedUser.getId());
}

    @GetMapping("/users")
    public java.util.List<User> getAllUsers() {
        return service.getAllUsers();
    }

public static class AuthResponse {
    public String token;
    public String role;
    public String name;
    public Long id;

    public AuthResponse(String token, String role, String name, Long id) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.id = id;
    }
}
}