package com.pos.service;

import com.pos.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<User> findAll();
    User findById(UUID id);
}
