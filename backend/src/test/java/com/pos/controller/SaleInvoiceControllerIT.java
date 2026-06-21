package com.pos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pos.dto.request.SaleInvoiceItemRequest;
import com.pos.dto.request.SaleInvoiceRequest;
import com.pos.dto.response.SaleInvoiceResponse;
import com.pos.service.SaleInvoiceService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SaleInvoiceControllerIT {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @org.mockito.Mock private SaleInvoiceService saleInvoiceService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        SaleInvoiceController controller = new SaleInvoiceController(saleInvoiceService);
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(controller).build();
    }

    @org.junit.jupiter.api.Test
    void getAll_sales_returnsOk() throws Exception {
        SaleInvoiceResponse r = new SaleInvoiceResponse();
        r.setId(UUID.randomUUID()); r.setInvoiceNumber("INV-1");
        when(saleInvoiceService.getAllSales()).thenReturn(List.of(r));

        mockMvc.perform(get("/api/sales").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @org.junit.jupiter.api.Test
    void create_sale_returnsCreated() throws Exception {
        SaleInvoiceItemRequest item = new SaleInvoiceItemRequest();
        item.setProductId(UUID.randomUUID()); item.setQuantity(1); item.setUnitPrice(10.0);
        SaleInvoiceRequest req = new SaleInvoiceRequest();
        req.setBranchId(UUID.randomUUID()); req.setCashierId(UUID.randomUUID()); req.setPaymentMethod("CASH");
        req.setItems(List.of(item)); req.setAmountPaid(10.0);

        SaleInvoiceResponse resp = new SaleInvoiceResponse(); resp.setId(UUID.randomUUID()); resp.setInvoiceNumber("INV-2");
        when(saleInvoiceService.createSale(org.mockito.ArgumentMatchers.any())).thenReturn(resp);

        mockMvc.perform(post("/api/sales").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.invoiceNumber").value("INV-2"));
    }
}
