package com.pos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PosInventoryBackendApplicationTests {
    @org.springframework.beans.factory.annotation.Autowired
    private com.pos.repository.UserRepository userRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.pos.service.AuthService authService;

    @Test
    void contextLoads() {
        System.out.println("DATABASE_DEBUG STARTING USER DUMP");
        userRepository.findAll().forEach(user -> {
            System.out.println("DATABASE_DEBUG User: " + user.getUsername() + " | Email: " + user.getEmail() + " | Password: " + user.getPassword() + " | Status: " + user.getStatus());
        });
        System.out.println("DATABASE_DEBUG ENDING USER DUMP");

        try {
            System.out.println("DATABASE_DEBUG ATTEMPTING LOGIN");
            var loginResp = authService.login(new com.pos.dto.request.LoginRequest("admin", "admin123"));
            System.out.println("DATABASE_DEBUG LOGIN SUCCESSFUL: " + loginResp);
            
            System.out.println("DATABASE_DEBUG ATTEMPTING GET_CURRENT_USER");
            var userResp = authService.getCurrentUser("admin");
            System.out.println("DATABASE_DEBUG GET_CURRENT_USER SUCCESSFUL: " + userResp);
        } catch (Exception e) {
            System.out.println("DATABASE_DEBUG OPERATION FAILED!");
            e.printStackTrace();
        }
    }
}
