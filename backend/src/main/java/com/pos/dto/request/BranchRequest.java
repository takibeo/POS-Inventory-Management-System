package com.pos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BranchRequest {

    @NotBlank(message = "Branch name must not be blank")
    @Size(max = 255, message = "Branch name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Branch code must not be blank")
    @Size(max = 100, message = "Branch code must not exceed 100 characters")
    private String code;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    public BranchRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
