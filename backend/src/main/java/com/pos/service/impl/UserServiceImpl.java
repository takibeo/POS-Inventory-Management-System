package com.pos.service.impl;

import lombok.extern.slf4j.Slf4j;

import com.pos.entity.User;
import com.pos.repository.UserRepository;
import com.pos.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        log.info("UserService.findAll called");
        return userRepository.findAll();
    }

    @Override
    public User findById(UUID id) {
        log.info("UserService.findById id={}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
