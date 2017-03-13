-- Table: public.player

-- DROP TABLE public.player;

CREATE TABLE public.player
(
    uid bigint NOT NULL,
    discriminator smallint NOT NULL,
    username character varying(32) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" DEFAULT ''::text,
    xp integer NOT NULL DEFAULT 0,
    wishes integer NOT NULL DEFAULT 0,
    deaths integer NOT NULL DEFAULT 0,
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