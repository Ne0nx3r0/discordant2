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