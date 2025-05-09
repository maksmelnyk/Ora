package com.example.profile.features.educatorProfile.contracts;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

@Getter
public class PagedResult<T> {
    private List<T> items;
    private int totalPages;
    private long totalItems;
    private int currentPage;
    private int pageSize;

    public PagedResult() {
        this.items = new ArrayList<>();
    }

    public PagedResult(List<T> items, int totalPages, long totalItems, int currentPage, int pageSize) {
        this.items = items == null ? new ArrayList<>() : items;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }
}