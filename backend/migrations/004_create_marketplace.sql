CREATE TABLE marketplace_products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'General',
    price NUMERIC(14, 2) NOT NULL CHECK (price > 0),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('USD', 'MMK')),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_marketplace_products_seller_id ON marketplace_products(seller_id);
CREATE INDEX ix_marketplace_products_active_created ON marketplace_products(is_active, created_at);

CREATE TABLE marketplace_orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivery_address TEXT NOT NULL,
    contact_phone VARCHAR(40) NOT NULL,
    buyer_note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED'
        CHECK (status IN ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_marketplace_orders_buyer_id ON marketplace_orders(buyer_id);
CREATE INDEX ix_marketplace_orders_seller_id ON marketplace_orders(seller_id);
CREATE INDEX ix_marketplace_orders_buyer_created ON marketplace_orders(buyer_id, created_at);
CREATE INDEX ix_marketplace_orders_seller_created ON marketplace_orders(seller_id, created_at);

CREATE TABLE marketplace_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES marketplace_products(id) ON DELETE RESTRICT,
    product_name VARCHAR(120) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price > 0),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('USD', 'MMK'))
);
CREATE INDEX ix_marketplace_order_items_order_id ON marketplace_order_items(order_id);
CREATE INDEX ix_marketplace_order_items_product_id ON marketplace_order_items(product_id);
