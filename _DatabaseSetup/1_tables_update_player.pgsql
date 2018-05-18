ALTER TABLE player
ADD COLUMN stalls smallint NOT NULL DEFAULT 0;

ALTER TABLE player
ADD COLUMN active_pet_id bigint DEFAULT NULL;

ALTER TABLE player
ADD CONSTRAINT pet_id_fk FOREIGN KEY (active_pet_id)
        REFERENCES public.player_pet (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT;