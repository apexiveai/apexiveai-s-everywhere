CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    starting_price NUMERIC(14, 2) NOT NULL CHECK (starting_price > 0),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('USD', 'MMK')),
    ends_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_auctions_seller_id ON auctions(seller_id);
CREATE INDEX ix_auctions_ends_at ON auctions(ends_at);
CREATE INDEX ix_auctions_created_at ON auctions(created_at);

CREATE TABLE auction_bids (
    id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX ix_auction_bids_auction_amount ON auction_bids(auction_id, amount);
CREATE INDEX ix_auction_bids_bidder_id ON auction_bids(bidder_id);
