-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_method` VARCHAR(191) NULL,
    ADD COLUMN `payment_url` TEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `recipient_name` VARCHAR(191) NULL,
    ADD COLUMN `shipping_address` TEXT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `xendit_invoice_id` VARCHAR(191) NULL;
