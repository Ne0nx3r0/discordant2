CREATE OR REPLACE FUNCTION unequip_player_item(inPlayerUID bigint,inEquipSlot equipmentslot) 
RETURNS int LANGUAGE plpgsql AS
$$

DECLARE
  unequippedItemId int;
BEGIN

--Get the currently equipped item or raise exception
  SELECT item_id INTO unequippedItemId FROM player_equipment_item WHERE player_uid = inPlayerUID AND slot = inEquipSlot LIMIT 1;
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'Account % does not have anything equipped to %', inPlayerUID,inEquipSlot
          USING ERRCODE = 'P0002';
  ELSE
-- If they had an item equipped, delete the equipped item and add it back to their inventory
    DELETE FROM player_equipment_item WHERE player_uid = inPlayerUID AND slot = inEquipSlot;
    UPDATE player_inventory_item SET amount = amount + 1 WHERE player_uid = inPlayerUID AND item_id = unequippedItemId;
    IF NOT FOUND THEN
      INSERT INTO player_inventory_item(player_uid,item_id,amount) VALUES(inPlayerUID,unequippedItemId,1);
    END IF;
  END IF;

--Return the unequipped item id
  RETURN unequippedItemId;
END

$$;