-- Table: public.player

-- DROP TABLE public.player;

CREATE TABLE public.player
(
    uid bigint NOT NULL,
    discriminator smallint NOT NULL,
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    wishes integer NOT NULL DEFAULT 0,
    gold integer NOT NULL DEFAULT 0,
    deaths integer NOT NULL DEFAULT 0,
    level smallint NOT NULL DEFAULT 1,
    class smallint NOT NULL DEFAULT 0,
    attribute_strength smallint NOT NULL DEFAULT 0,
    attribute_agility smallint NOT NULL DEFAULT 0,
    attribute_vitality smallint NOT NULL DEFAULT 0,
    attribute_spirit smallint NOT NULL DEFAULT 0,
    attribute_charisma smallint NOT NULL DEFAULT 0,
    attribute_luck smallint NOT NULL DEFAULT 0,
    karma integer NOT NULL DEFAULT 1,
    role character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'player'::character varying,
    created time without time zone DEFAULT now(),
    CONSTRAINT player_uid PRIMARY KEY (uid)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.player
    OWNER to discordant;

-- Index: uid_index_unique

-- DROP INDEX public.uid_index_unique;

CREATE UNIQUE INDEX uid_index_unique
    ON public.player USING btree
    (uid)
    TABLESPACE pg_default;












-- Table: public.player_inventory_item

-- DROP TABLE public.player_inventory_item;

CREATE TABLE public.player_inventory_item
(
    player_uid bigint NOT NULL,
    item_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT player_item_pkey PRIMARY KEY (player_uid, item_id),
    CONSTRAINT player_uid FOREIGN KEY (player_uid)
        REFERENCES public.player (uid) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.player_inventory_item
    OWNER to discordant;

-- Index: player_items_player_uid

-- DROP INDEX public.player_items_player_uid;

CREATE INDEX player_items_player_uid
    ON public.player_inventory_item USING btree
    (player_uid)
    TABLESPACE pg_default;










-- Type: equipmentslot

-- DROP TYPE public.equipmentslot;

CREATE TYPE public.equipmentslot AS ENUM
    ('armor', 'hat', 'bracer', 'ring', 'amulet', 'weapon', 'offhand');

ALTER TYPE public.equipmentslot
    OWNER TO discordant;







-- Table: public.player_equipment_item

-- DROP TABLE public.player_equipment_item;

CREATE TABLE public.player_equipment_item
(
  player_uid bigint NOT NULL,
  item_id integer NOT NULL,
  slot equipmentslot NOT NULL DEFAULT 'armor'::equipmentslot,
  CONSTRAINT primary_key_slot_player PRIMARY KEY (slot, player_uid),
  CONSTRAINT player_equipment_player_uid_fkey FOREIGN KEY (player_uid)
      REFERENCES public.player (uid) MATCH SIMPLE
      ON UPDATE RESTRICT ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.player_equipment_item
  OWNER TO discordant;

-- Index: public.player_equipment_item_player_uid_idx

-- DROP INDEX public.player_equipment_item_player_uid_idx;

CREATE INDEX player_equipment_item_player_uid_idx
  ON public.player_equipment_item
  USING btree
  (player_uid);









-- Table: public.market_offer

-- DROP TABLE public.market_offer;

CREATE SEQUENCE market_offers_id_seq START 1;

CREATE TABLE public.market_offer
(
  id bigint NOT NULL DEFAULT nextval('market_offers_id_seq'::regclass),
  created timestamp without time zone NOT NULL DEFAULT now(),
  updated timestamp without time zone NOT NULL DEFAULT now(),
  seller_uid bigint NOT NULL,
  item_id integer NOT NULL,
  amount_left integer NOT NULL,
  price integer NOT NULL,
  ended boolean NOT NULL DEFAULT false,
  CONSTRAINT mo_primary_key PRIMARY KEY (id),
  CONSTRAINT mo_player_uid FOREIGN KEY (seller_uid)
      REFERENCES public.player (uid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.market_offer
  OWNER TO discordant;

-- Index: public.market_offer_item_id_idx

-- DROP INDEX public.market_offer_item_id_idx;

CREATE INDEX market_offer_item_id_idx
  ON public.market_offer
  USING btree
  (item_id);

-- Index: public.market_offer_item_id_seller_uid_idx

-- DROP INDEX public.market_offer_item_id_seller_uid_idx;

CREATE INDEX market_offer_item_id_seller_uid_idx
  ON public.market_offer
  USING btree
  (item_id, seller_uid);

-- Index: public.market_offer_seller_uid_idx

-- DROP INDEX public.market_offer_seller_uid_idx;

CREATE INDEX market_offer_seller_uid_idx
  ON public.market_offer
  USING btree
  (seller_uid);






-- Table: public.market_offer_purchase

-- DROP TABLE public.market_offer_purchase;

CREATE SEQUENCE market_offer_purchase_id_seq START 1;

CREATE TABLE public.market_offer_purchase
(
  id bigint NOT NULL DEFAULT nextval('market_offer_purchase_id_seq'::regclass),
  created time without time zone NOT NULL DEFAULT now(),
  offer_id bigint NOT NULL,
  buyer_uid bigint NOT NULL,
  CONSTRAINT mop_pk PRIMARY KEY (id),
  CONSTRAINT mop_buyer_uid_fk FOREIGN KEY (buyer_uid)
      REFERENCES public.player (uid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT mop_offer_id_fk FOREIGN KEY (offer_id)
      REFERENCES public.market_offer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.market_offer_purchase
  OWNER TO discordant;

-- Index: public.fki_mop_buyer_uid_fk

-- DROP INDEX public.fki_mop_buyer_uid_fk;

CREATE INDEX fki_mop_buyer_uid_fk
  ON public.market_offer_purchase
  USING btree
  (buyer_uid);

-- Index: public.fki_mop_offer_id

-- DROP INDEX public.fki_mop_offer_id;

CREATE INDEX fki_mop_offer_id
  ON public.market_offer_purchase
  USING btree
  (offer_id);

