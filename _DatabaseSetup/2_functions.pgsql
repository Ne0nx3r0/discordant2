CREATE OR REPLACE FUNCTION grant_player_item(toPlayerUID bigint,transferItemId int,transferAmount int) 
RETURNS void LANGUAGE plpgsql AS
$$
BEGIN
  UPDATE player_inventory_item SET amount = amount + transferAmount WHERE player_uid = toPlayerUID AND item_id = transferItemId;
  IF NOT FOUND THEN 
    INSERT INTO player_inventory_item(player_uid,item_id,amount) values (toPlayerUID,transferItemId,transferAmount); 
  END IF; 
END
$$;







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





CREATE OR REPLACE FUNCTION take_player_item(fromPlayerUID bigint,takeItemId int,takeAmount int) 
RETURNS void LANGUAGE plpgsql AS
$$
DECLARE
  currentAmount int;
BEGIN
  SELECT amount INTO currentAmount FROM player_inventory_item WHERE player_uid = fromPlayerUID AND item_id = takeItemId LIMIT 1;

  IF takeAmount < currentAmount THEN
    UPDATE player_inventory_item SET amount = amount - takeAmount WHERE player_uid = fromPlayerUID AND item_id = takeItemId;
  ELSIF takeAmount = currentAmount THEN
    DELETE FROM player_inventory_item WHERE player_uid = fromPlayerUID AND item_id = takeItemId;
  ELSE
    RAISE EXCEPTION 'Account % does not have % of item id %, only has %', fromPlayerUID,takeAmount,takeItemId,currentAmount
          USING ERRCODE = 'P0002';
  END IF;
END
$$;




CREATE OR REPLACE FUNCTION transfer_player_item(fromPlayerUID bigint,toPlayerUID bigint,transferItemId int,transferAmount int) 
RETURNS void LANGUAGE plpgsql AS
$$

DECLARE
  fromAmount int;
BEGIN
  SELECT amount INTO fromAmount FROM player_inventory_item WHERE player_uid = fromPlayerUID AND item_id = transferItemId LIMIT 1;

  IF fromAmount > transferAmount THEN
    UPDATE player_inventory_item SET amount = amount - transferAmount WHERE player_uid = fromPlayerUID AND item_id = transferItemId;
  ELSIF fromAmount = transferAmount THEN
    DELETE FROM player_inventory_item WHERE player_uid = fromPlayerUID AND item_id = transferItemId;
  ELSE
    RAISE EXCEPTION 'Account % does not have % of item id %', fromPlayerUID,transferAmount,transferItemId
          USING ERRCODE = 'P0002';
  END IF;

  UPDATE player_inventory_item SET amount = amount + transferAmount WHERE player_uid = toPlayerUID AND item_id = transferItemId;
  IF NOT FOUND THEN 
    INSERT INTO player_inventory_item(player_uid,item_id,amount) values (toPlayerUID,transferItemId,transferAmount); 
  END IF; 
END

$$;



CREATE OR REPLACE FUNCTION levelup_player(playerUid bigint,chosenStat varchar,wishesNeeded integer) 
RETURNS void LANGUAGE plpgsql AS
$$

DECLARE
  currentWishes int;
BEGIN
    SELECT wishes INTO currentWishes FROM player WHERE uid = playerUid LIMIT 1;

    IF wishesNeeded > currentWishes THEN
      RAISE EXCEPTION 'Player needs at least % wishes to level up', wishesNeeded
            USING ERRCODE = 'P0002';
    END IF;

    EXECUTE 'UPDATE player SET wishes = player.wishes - '|| wishesNeeded ||',attribute_' || chosenStat || '= attribute_' || chosenStat || '+1 WHERE uid = '|| playerUid;

    UPDATE player SET level = player.level+1 WHERE uid = playerUid;
END
$$;
