package com.pos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BranchRequest {

    @NotBlank(message = "Tên chi nhánh không được để trống")
    @Size(max = 255, message = "Tên chi nhánh không vượt quá 255 ký tự")
    private String name;

    @NotBlank(message = "Mã chi nhánh không được để trống")
    @Size(max = 100, message = "Mã chi nhánh không vượt quá 100 ký tự")
    private String code;

    @Size(max = 500, message = "Địa chỉ không vượt quá 500 ký tự")
    private String address;

    @Size(max = 50, message = "Số điện thoại không vượt quá 50 ký tự")
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
