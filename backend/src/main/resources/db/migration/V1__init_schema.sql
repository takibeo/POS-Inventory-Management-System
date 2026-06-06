CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE roles (
                       id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name        VARCHAR(50)  NOT NULL UNIQUE,
                       description TEXT,
                       created_at  TIMESTAMP NOT NULL DEFAULT now(),
                       updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE users (
                       id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username    VARCHAR(100) NOT NULL UNIQUE,
                       email       VARCHAR(150) NOT NULL UNIQUE,
                       password    TEXT         NOT NULL,
                       full_name   VARCHAR(150),
                       status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                           CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED')),
                       created_at  TIMESTAMP NOT NULL DEFAULT now(),
                       updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
                            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                            PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
                                id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id     UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token       TEXT      NOT NULL UNIQUE,
                                expiry_date TIMESTAMP NOT NULL,
                                revoked     BOOLEAN   NOT NULL DEFAULT FALSE,
                                created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE branches (
                          id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          name        VARCHAR(150) NOT NULL,
                          code        VARCHAR(50)  NOT NULL UNIQUE,
                          address     TEXT,
                          phone       VARCHAR(50),
                          manager_id  UUID REFERENCES users(id),
                          created_at  TIMESTAMP NOT NULL DEFAULT now(),
                          updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categories (
                            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name        VARCHAR(150) NOT NULL,
                            description TEXT,
                            created_at  TIMESTAMP NOT NULL DEFAULT now(),
                            updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE suppliers (
                           id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           name         VARCHAR(150) NOT NULL,
                           contact_name VARCHAR(150),
                           phone        VARCHAR(50),
                           email        VARCHAR(150),
                           address      TEXT,
                           notes        TEXT,
                           created_at   TIMESTAMP NOT NULL DEFAULT now(),
                           updated_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE products (
                          id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          sku           VARCHAR(100)   NOT NULL UNIQUE,
                          name          VARCHAR(200)   NOT NULL,
                          description   TEXT,
                          category_id   UUID REFERENCES categories(id),
                          supplier_id   UUID REFERENCES suppliers(id),
                          price         NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
                          cost          NUMERIC(14, 2) NOT NULL CHECK (cost >= 0),
                          barcode       VARCHAR(100),
                          unit          VARCHAR(50),
                          reorder_level INTEGER        NOT NULL DEFAULT 0,
                          is_active     BOOLEAN        NOT NULL DEFAULT TRUE,
                          created_at    TIMESTAMP      NOT NULL DEFAULT now(),
                          updated_at    TIMESTAMP      NOT NULL DEFAULT now()
);

CREATE TABLE inventories (
                             id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             branch_id         UUID    NOT NULL REFERENCES branches(id),
                             product_id        UUID    NOT NULL REFERENCES products(id),
                             quantity          INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
                             reserved_quantity INTEGER NOT NULL DEFAULT 0,
                             last_updated      TIMESTAMP NOT NULL DEFAULT now(),
                             UNIQUE (branch_id, product_id)
);

CREATE TABLE inventory_transactions (
                                        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        inventory_id     UUID        NOT NULL REFERENCES inventories(id),
                                        transaction_type VARCHAR(50) NOT NULL
                                            CHECK (transaction_type IN
                                                   ('IN','OUT','ADJUSTMENT','RETURN')),
                                        quantity         INTEGER     NOT NULL,
                                        remark           TEXT,
                                        reference_id     UUID,
                                        created_by       UUID REFERENCES users(id),
                                        created_at       TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE purchase_orders (
                                 id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 order_number  VARCHAR(100)   NOT NULL UNIQUE,
                                 supplier_id   UUID           NOT NULL REFERENCES suppliers(id),
                                 branch_id     UUID           NOT NULL REFERENCES branches(id),
                                 status        VARCHAR(50)    NOT NULL DEFAULT 'PENDING'
                                     CHECK (status IN
                                            ('PENDING','APPROVED','RECEIVED','CANCELLED')),
                                 ordered_date  DATE,
                                 received_date DATE,
                                 total_amount  NUMERIC(14, 2),
                                 created_by    UUID REFERENCES users(id),
                                 approved_by   UUID REFERENCES users(id),
                                 notes         TEXT,
                                 created_at    TIMESTAMP NOT NULL DEFAULT now(),
                                 updated_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE purchase_order_items (
                                      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                      purchase_order_id UUID           NOT NULL
                                          REFERENCES purchase_orders(id) ON DELETE CASCADE,
                                      product_id        UUID           NOT NULL REFERENCES products(id),
                                      quantity          INTEGER        NOT NULL CHECK (quantity > 0),
                                      cost              NUMERIC(14, 2) NOT NULL CHECK (cost >= 0),
                                      created_at        TIMESTAMP      NOT NULL DEFAULT now()
);

CREATE TABLE sale_invoices (
                               id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               invoice_number VARCHAR(100)   NOT NULL UNIQUE,
                               branch_id      UUID           NOT NULL REFERENCES branches(id),
                               cashier_id     UUID           NOT NULL REFERENCES users(id),
                               customer_name  VARCHAR(150),
                               status         VARCHAR(50)    NOT NULL DEFAULT 'COMPLETED'
                                   CHECK (status IN
                                          ('DRAFT','COMPLETED','REFUNDED','CANCELLED')),
                               total_amount   NUMERIC(14, 2) NOT NULL DEFAULT 0,
                               tax            NUMERIC(14, 2) NOT NULL DEFAULT 0,
                               discount       NUMERIC(14, 2) NOT NULL DEFAULT 0,
                               payment_method VARCHAR(50)
                                   CHECK (payment_method IN
                                          ('CASH','CARD','TRANSFER','OTHER')),
                               amount_paid    NUMERIC(14, 2),
                               change_amount  NUMERIC(14, 2),
                               created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE sale_invoice_items (
                                    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    sale_invoice_id UUID           NOT NULL
                                        REFERENCES sale_invoices(id) ON DELETE CASCADE,
                                    product_id      UUID           NOT NULL REFERENCES products(id),
                                    quantity        INTEGER        NOT NULL CHECK (quantity > 0),
                                    unit_price      NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
                                    discount        NUMERIC(14, 2) NOT NULL DEFAULT 0,
                                    created_at      TIMESTAMP      NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_supplier  ON products(supplier_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_sku       ON products(sku);
CREATE INDEX idx_inv_branch         ON inventories(branch_id);
CREATE INDEX idx_inv_product        ON inventories(product_id);
CREATE INDEX idx_sale_branch        ON sale_invoices(branch_id);
CREATE INDEX idx_sale_created       ON sale_invoices(created_at);