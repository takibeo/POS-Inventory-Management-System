package com.pos.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierRequest {

    @NotBlank(message = "Tên nhà cung cấp không được để trống")
    @Size(max = 255, message = "Tên nhà cung cấp không vượt quá 255 ký tự")
    private String name;

    @Size(max = 255, message = "Tên liên hệ không vượt quá 255 ký tự")
    private String contactName;

    @Size(max = 50, message = "Số điện thoại không vượt quá 50 ký tự")
    private String phone;

    @Email(message = "Email không hợp lệ")
    @Size(max = 255, message = "Email không vượt quá 255 ký tự")
    private String email;

    @Size(max = 500, message = "Địa chỉ không vượt quá 500 ký tự")
    private String address;

    @Size(max = 1000, message = "Ghi chú không vượt quá 1000 ký tự")
    private String notes;

    public SupplierRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
