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