package com.pos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pos.dto.request.PurchaseOrderItemRequest;
import com.pos.dto.request.PurchaseOrderRequest;
import com.pos.dto.response.PurchaseOrderResponse;
import com.pos.service.PurchaseOrderService;
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
class PurchaseOrderControllerIT {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @org.mockito.Mock private PurchaseOrderService purchaseOrderService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        PurchaseOrderController controller = new PurchaseOrderController(purchaseOrderService);
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(controller).build();
    }

    @org.junit.jupiter.api.Test
    void getAll_purchaseOrders_returnsOk() throws Exception {
        PurchaseOrderResponse r = new PurchaseOrderResponse(); r.setId(UUID.randomUUID()); r.setOrderNumber("PO-1");
        when(purchaseOrderService.getAllPurchaseOrders(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any())).thenReturn(List.of(r));

        mockMvc.perform(get("/api/purchase-orders").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @org.junit.jupiter.api.Test
    void create_purchaseOrder_returnsCreated() throws Exception {
        PurchaseOrderItemRequest item = new PurchaseOrderItemRequest(); item.setProductId(UUID.randomUUID()); item.setQuantity(2); item.setCost(5.0);
        PurchaseOrderRequest req = new PurchaseOrderRequest(); req.setSupplierId(UUID.randomUUID()); req.setBranchId(UUID.randomUUID()); req.setItems(List.of(item));

        PurchaseOrderResponse resp = new PurchaseOrderResponse(); resp.setId(UUID.randomUUID()); resp.setOrderNumber("PO-2");
        when(purchaseOrderService.createPurchaseOrder(org.mockito.ArgumentMatchers.any())).thenReturn(resp);

        mockMvc.perform(post("/api/purchase-orders").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").value("PO-2"));
    }
}
