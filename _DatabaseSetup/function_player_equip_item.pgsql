CREATE OR REPLACE FUNCTION equip_player_item(inPlayerUID bigint,inItemID int,inEquipSlot equipmentslot) 
RETURNS int LANGUAGE plpgsql AS
$$

DECLARE
  unequippedItemId int;
  amountOfItemInPlayerInv int;
BEGIN
  SELECT amount INTO amountOfItemInPlayerInv FROM player_inventory_item WHERE player_uid = inPlayerUID AND item_id = inItemID LIMIT 1;

-- Remove a copy of the item to equip from their inventory or throw exception if they don't have it
  IF amountOfItemInPlayerInv > 1 THEN
    UPDATE player_inventory_item SET amount = amount - 1 WHERE player_uid = inPlayerUID AND item_id = inItemID;
  ELSIF amountOfItemInPlayerInv = 1 THEN
    DELETE FROM player_inventory_item WHERE player_uid = inPlayerUID AND item_id = inItemID;
  ELSE
    RAISE EXCEPTION 'Account % does not have % to equip', inPlayerUID,inItemID
          USING ERRCODE = 'P0002';
  END IF;

--Get the currently equipped item or -1
  SELECT item_id INTO unequippedItemId FROM player_equipment_item WHERE player_uid = inPlayerUID AND slot = inEquipSlot LIMIT 1;
  IF NOT FOUND THEN 
    unequippedItemId := -1;
  ELSE
-- If they had an item equipped, add it back to their inventory
    UPDATE player_inventory_item SET amount = amount + 1 WHERE player_uid = inPlayerUID AND item_id = unequippedItemId;
    IF NOT FOUND THEN
      INSERT INTO player_inventory_item(player_uid,item_id,amount) VALUES(inPlayerUID,unequippedItemId,1);
    END IF;
  END IF;

--Equip the new item to them
  UPDATE player_equipment_item SET item_id = inItemID WHERE player_uid = inPlayerUID AND slot = inEquipSlot;
  IF NOT FOUND THEN 
    INSERT INTO player_equipment_item(player_uid,item_id,slot) values (inPlayerUID,inItemID,inEquipSlot); 
  END IF;

--Return the unequipped item id
  RETURN unequippedItemId;
END

$$;