DELETE FROM pg_enum
WHERE enumlabel = 'bracer'
AND enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'equipmentslot'
);
ALTER TYPE equipmentslot ADD VALUE 'pouch';