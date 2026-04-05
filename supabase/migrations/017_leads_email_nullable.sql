-- Imports and CRM allow phone- or name-only leads; email must be optional.
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;
