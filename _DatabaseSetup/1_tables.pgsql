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
    level smallint NOT NULL DEFAULT 0,
    class smallint NOT NULL DEFAULT 0,
    attribute_strength smallint NOT NULL DEFAULT 0,
    attribute_agility smallint NOT NULL DEFAULT 0,
    attribute_vitality smallint NOT NULL DEFAULT 0,
    attribute_spirit smallint NOT NULL DEFAULT 0,
    attribute_charisma smallint NOT NULL DEFAULT 0,
    attribute_luck smallint NOT NULL DEFAULT 0,
    karma integer NOT NULL DEFAULT 1,
    role character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'player'::character varying,
    created_at timestamp without time zone DEFAULT now(),
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
      ON UPDATE RESTRICT 
      ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.player_equipment_item
    OWNER to discordant;