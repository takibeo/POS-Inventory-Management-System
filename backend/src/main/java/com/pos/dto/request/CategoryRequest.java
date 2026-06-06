package com.pos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 2, max = 255, message = "Tên danh mục từ 2 đến 255 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả không vượt quá 1000 ký tự")
    private String description;

    public CategoryRequest() {}

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name!=null?name.trim():null;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
