CREATE INDEX `mortgage_calculation_user_id_status_idx` ON `MortgageCalculation` (`userId`,`status`);--> statement-breakpoint
CREATE INDEX `mortgage_calculation_profile_id_idx` ON `MortgageCalculation` (`mortgageProfileId`);--> statement-breakpoint
CREATE INDEX `mortgage_profile_user_id_idx` ON `MortgageProfile` (`userId`);