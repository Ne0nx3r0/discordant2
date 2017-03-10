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