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