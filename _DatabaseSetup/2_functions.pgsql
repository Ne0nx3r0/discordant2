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
  currentWishes integer;
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








CREATE OR REPLACE FUNCTION market_sell_item(playerUid bigint,itemId integer,sellAmount integer,price integer) 
RETURNS bigint LANGUAGE plpgsql AS
$$

DECLARE
  currentMarketOffer bigint;
  currentMarketOffersCount integer;
  currentItemAmount integer;
  newMarketOffer bigint;
BEGIN
  -- Check if the player has more than 10 items for sale already
  SELECT COUNT(*) INTO currentMarketOffersCount FROM market_offer WHERE seller_uid = playerUid AND ended = false;

  IF currentMarketOffersCount >= 10 THEN
    RAISE EXCEPTION 'You cannot have more than 10 offers at once'
      USING ERRCODE = 'P0002';  
  END IF;

  -- Check if they have enough of the item and remove that amount from their inventory if so
  SELECT amount INTO currentItemAmount FROM player_inventory_item WHERE player_uid = playerUid AND item_id = itemId LIMIT 1;

  IF currentItemAmount IS NULL THEN
    RAISE EXCEPTION 'You do not have any of that item'
          USING ERRCODE = 'P0002';  
  ELSIF currentItemAmount > sellAmount THEN
    UPDATE player_inventory_item SET amount = amount - sellAmount WHERE player_uid = playerUid AND item_id = itemId;
  ELSIF currentItemAmount = sellAmount THEN
    DELETE FROM player_inventory_item WHERE player_uid = playerUid AND item_id = itemId;
  ELSE  
    RAISE EXCEPTION 'You only have % of that item',currentItemAmount
          USING ERRCODE = 'P0002';  
  END IF;

   INSERT INTO market_offer(seller_uid,item_id,amount_left,price,ended) VALUES(playerUid,itemId,sellAmount,price,false) RETURNING id INTO newMarketOffer;

   return newMarketOffer;
END
$$;






CREATE OR REPLACE FUNCTION market_stop_offer(offerId bigint) 
RETURNS integer LANGUAGE plpgsql AS
$$

DECLARE
  amountLeft integer;
  itemId integer;
  sellerUid bigint;
  isEnded boolean;
BEGIN
  SELECT 
    amount_left,item_id,seller_uid,ended
    INTO
    amountLeft,itemId,sellerUid,isEnded
  FROM market_offer WHERE id = offerId;

  IF amountLeft IS NULL THEN
    RAISE EXCEPTION 'Offer not found "%"',offerId
      USING ERRCODE = 'P0002';
  END IF;

  IF isEnded THEN
    RAISE EXCEPTION 'Offer is already ended "%"',offerId
      USING ERRCODE = 'P0002';
  END IF;

  IF amountLeft > 0 THEN
    UPDATE player_inventory_item SET amount = amount + amountLeft WHERE player_uid = sellerUid AND item_id = itemId;
    IF NOT FOUND THEN 
      INSERT INTO player_inventory_item(player_uid,item_id,amount) values (sellerUid,itemId,amountLeft); 
    END IF;
  END IF;

  UPDATE market_offer SET ended = TRUE, updated = NOW() WHERE id = offerId;

  return amountLeft;
END
$$;








CREATE OR REPLACE FUNCTION market_buy_offer(buyerUid bigint,offerId bigint,amountWanted integer
,OUT out_amount_purchased integer
,OUT out_total_cost integer
,OUT out_item_id integer
,OUT out_seller_uid bigint
,OUT out_amount_left integer
) 
LANGUAGE plpgsql AS
$$

DECLARE
  amountLeft integer;
  itemId integer;
  sellerUid bigint;
  isEnded boolean;
  totalCost integer;
  amountToBuy integer;
  buyerGold integer;
  itemPrice integer;
BEGIN

-- Get if offer exists
  SELECT amount_left, item_id,   ended, seller_uid, price
  INTO    amountLeft,  ItemId, isEnded,  sellerUid, itemPrice
  FROM market_offer
  WHERE ID = offerId 
  LIMIT 1;

-- Buying all
  IF amountWanted = -1 THEN
    amountToBuy := amountLeft;

-- Not enough left
  ELSIF amountWanted > amountLeft THEN
    RAISE EXCEPTION 'Only % left for sale on that offer',amountLeft
      USING ERRCODE = 'P0002';
  ELSE
    amountToBuy := amountWanted;
  END IF;

--Offer not found
  IF amountLeft IS NULL THEN
    RAISE EXCEPTION 'Offer not found "%"',offerId
      USING ERRCODE = 'P0002';
  END IF;

--Offer ended already
  IF isEnded THEN
    RAISE EXCEPTION 'Offer is already ended "%"',offerId
      USING ERRCODE = 'P0002';
  END IF;

-- calculate total cost with amount*price
  totalCost := amountToBuy * itemPrice;

-- Check if buyer has that much
  SELECT gold INTO buyerGold FROM player WHERE uid = buyerUid LIMIT 1;

  IF buyerGold < totalCost THEN
    RAISE EXCEPTION 'You only have %GP, need at least %GP',buyerGold,totalCost
      USING ERRCODE = 'P0002';
  END IF;

  out_amount_left := amountLeft-amountToBuy;

-- Update listing
  IF amountToBuy = amountLeft THEN
-- End offer
    UPDATE market_offer SET ended=true,amount_left=0,updated=NOW() WHERE id = offerId;
  ELSE
-- Remove some items but leave offer up
    UPDATE market_offer SET amount_left=out_amount_left,updated=NOW() WHERE id = offerId;
  END IF;

-- Remove gold from buyer
  UPDATE player SET gold = gold - totalCost WHERE uid = buyerUid;

-- Give gold to seller
  UPDATE player SET gold = gold + totalCost WHERE uid = sellerUid;

-- Add items to seller
  PERFORM grant_player_item(buyerUid,itemId,amountToBuy);

-- Return some data the app will need
  out_amount_purchased := amountToBuy;
  out_total_cost := totalCost;
  out_item_id := itemId;
  out_seller_uid := sellerUid;
END
$$;








CREATE OR REPLACE FUNCTION convert_wishes_to_gold(playerUid bigint,amountToConvert integer) 
RETURNS integer LANGUAGE plpgsql AS
$$

DECLARE
  currentWishes integer;
  goldEarned integer := amountToConvert * 2;
BEGIN
  SELECT wishes INTO currentWishes FROM player WHERE uid = playerUid LIMIT 1;

  IF amountToConvert > currentWishes THEN
    RAISE EXCEPTION 'You only have % wishes',currentWishes
          USING ERRCODE = 'P0002';
  ELSE
    UPDATE player SET wishes = wishes - amountToConvert, gold = gold + goldEarned WHERE uid = playerUid;
  END IF;

  RETURN goldEarned;
END

$$;







CREATE OR REPLACE FUNCTION buy_item(inBuyerUid bigint,inItemId integer,inAmountToBuy integer,inGoldNeeded integer)
RETURNS VOID
LANGUAGE plpgsql AS
$$

DECLARE
  buyerGold integer;
BEGIN

-- Attempt to take gold from player
  UPDATE player
  SET    gold = gold - inGoldNeeded 
  WHERE  uid = inBuyerUid;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough gold'
      USING ERRCODE = 'P0002';
  END IF;

-- Add items to buyer
  PERFORM grant_player_item(inBuyerUid,inItemId,inAmountToBuy);
END
$$;



CREATE OR REPLACE FUNCTION transfer_player_gold(fromPlayerUID bigint,toPlayerUID bigint,transferAmount int) 
RETURNS void LANGUAGE plpgsql AS
$$

BEGIN
  UPDATE player SET gold = gold - transferAmount WHERE uid = fromPlayerUID AND gold >= transferAmount;
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'You do not have % gold',transferAmount
          USING ERRCODE = 'P0002';
  END IF; 

  UPDATE player SET gold = gold + transferAmount WHERE uid = toPlayerUID;
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'Player UID % is not registered yet',toPlayerUID
          USING ERRCODE = 'P0002';
  END IF; 
END

$$;