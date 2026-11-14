-- Remove KYC storage now that customer onboarding and lending no longer use it.
DROP INDEX IF EXISTS idx_customer_profiles_kyc_status;
ALTER TABLE customer_profiles DROP CONSTRAINT IF EXISTS customer_kyc_status_check;
ALTER TABLE customer_profiles DROP COLUMN IF EXISTS kyc_status;
ALTER TABLE customer_profiles
    DROP COLUMN IF EXISTS date_of_birth,
    DROP COLUMN IF EXISTS phone,
    DROP COLUMN IF EXISTS address_line1,
    DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS country;
