--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id         INTEGER PRIMARY KEY,
  first_name TEXT    NOT NULL,
  last_name  TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  balance    NUMERIC NOT NULL DEFAULT 0.00
);

CREATE TABLE Widget (
  id          INTEGER PRIMARY KEY,
  id_seller   INTEGER NOT NULL,
  description TEXT    NOT NULL,
  price       NUMERIC NOT NULL DEFAULT 0.00,
  purchased   NUMERIC NOT NULL DEFAULT 0,
  CONSTRAINT Widget_ck_purchased CHECK (purchased IN (0, 1)),
  CONSTRAINT Widget_fk_id_seller FOREIGN KEY (id_seller)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX Widget_ix_id_seller ON Widget (id_seller);

CREATE TABLE Transaction_Record (
  id             INTEGER PRIMARY KEY,
  id_buyer       INTEGER NOT NULL,
  id_seller      INTEGER NOT NULL,
  id_widget      INTEGER NOT NULL,
  datetime_unix  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Transaction_Record_fk_id_buyer FOREIGN KEY (id_buyer)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT Transaction_Record_fk_id_seller FOREIGN KEY (id_seller)
    REFERENCES User (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT Transaction_Record_fk_id_widget FOREIGN KEY (id_widget)
    REFERENCES Widget (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX Transaction_Record_ix_id_buyer ON Transaction_Record (id_buyer);
CREATE INDEX Transaction_Record_ix_id_seller ON Transaction_Record (id_seller);
CREATE INDEX Transaction_Record_ix_id_widget ON Transaction_Record (id_widget);

CREATE TABLE Fee (
  id          INTEGER PRIMARY KEY,
  marketplace NUMERIC NOT NULL DEFAULT 0.05
);

INSERT INTO Fee DEFAULT VALUES;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Widget_ix_id_seller;
DROP INDEX Transaction_Record_ix_id_buyer;
DROP INDEX Transaction_Record_ix_id_seller;
DROP INDEX Transaction_Record_ix_id_widget;
DROP TABLE User;
DROP TABLE Widget;
DROP TABLE Transaction_Record;
DROP TABLE Fee;
