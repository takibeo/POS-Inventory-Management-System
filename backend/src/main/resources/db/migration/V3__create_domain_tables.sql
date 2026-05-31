-- Create tables for products, inventory, purchase orders, sales, and refresh tokens

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    manager_id UUID,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_branches_manager FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(150),
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID,
    supplier_id UUID,
    price NUMERIC(14,2) NOT NULL,
    cost NUMERIC(14,2) NOT NULL,
    barcode VARCHAR(100),
    unit VARCHAR(50),
    reorder_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS inventories (
    id UUID PRIMARY KEY,
    branch_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER NOT NULL,
    last_updated TIMESTAMP,
    CONSTRAINT fk_inventories_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    CONSTRAINT fk_inventories_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    remark TEXT,
    reference_id UUID,
    created_by UUID,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_inventory_transactions_inventory FOREIGN KEY (inventory_id) REFERENCES inventories(id),
    CONSTRAINT fk_inventory_transactions_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    supplier_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    ordered_date DATE,
    received_date DATE,
    total_amount NUMERIC(14,2),
    created_by UUID,
    approved_by UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_purchase_orders_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_purchase_orders_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    CONSTRAINT fk_purchase_orders_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_purchase_orders_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY,
    purchase_order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    cost NUMERIC(14,2) NOT NULL,
    subtotal NUMERIC(14,2),
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_purchase_order_items_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    CONSTRAINT fk_purchase_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS sale_invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    branch_id UUID NOT NULL,
    cashier_id UUID NOT NULL,
    customer_name VARCHAR(150),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT now(),
    total_amount NUMERIC(14,2),
    tax NUMERIC(14,2),
    discount NUMERIC(14,2),
    payment_method VARCHAR(50),
    amount_paid NUMERIC(14,2),
    change_amount NUMERIC(14,2),
    CONSTRAINT fk_sale_invoices_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    CONSTRAINT fk_sale_invoices_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sale_invoice_items (
    id UUID PRIMARY KEY,
    sale_invoice_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(14,2),
    discount NUMERIC(14,2),
    subtotal NUMERIC(14,2),
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_sale_invoice_items_invoice FOREIGN KEY (sale_invoice_id) REFERENCES sale_invoices(id),
    CONSTRAINT fk_sale_invoice_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);
