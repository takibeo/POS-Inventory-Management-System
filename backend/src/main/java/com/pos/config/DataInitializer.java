package com.pos.config;

import com.pos.entity.Role;
import com.pos.entity.User;
import com.pos.repository.RoleRepository;
import com.pos.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Component
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        Role adminRole = createRoleIfMissing("ADMIN", "Administrator role with full access");
        createRoleIfMissing("MANAGER", "Manager role for reporting and inventory oversight");
        createRoleIfMissing("CASHIER", "Cashier role for sales operations");
        createRoleIfMissing("WAREHOUSE_STAFF", "Warehouse staff role for inventory management");

        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setId(UUID.randomUUID());
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFullName("System Administrator");
            adminUser.setStatus("ACTIVE");
            adminUser.setCreatedAt(Instant.now());
            adminUser.setUpdatedAt(Instant.now());
            adminUser.setRoles(Set.of(adminRole));
            userRepository.save(adminUser);
        }
    }

    private Role createRoleIfMissing(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setId(UUID.randomUUID());
            role.setName(name);
            role.setDescription(description);
            return roleRepository.save(role);
        });
    }
}
