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