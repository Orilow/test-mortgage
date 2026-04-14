ALTER TABLE `MortgageCalculation` ADD `inputHash` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `MortgageCalculation` ADD `status` varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `MortgageCalculation` ADD `errorMessage` text;--> statement-breakpoint
ALTER TABLE `MortgageCalculation` ADD CONSTRAINT `mortgage_calculation_input_hash_idx` UNIQUE(`inputHash`);