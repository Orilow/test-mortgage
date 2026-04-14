CREATE TABLE `MortgageCalculation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`mortgageProfileId` int NOT NULL,
	`monthlyPayment` decimal NOT NULL,
	`totalPayment` decimal NOT NULL,
	`totalOverpaymentAmount` decimal NOT NULL,
	`possibleTaxDeduction` decimal NOT NULL,
	`savingsDueMotherCapital` decimal NOT NULL,
	`recommendedIncome` decimal NOT NULL,
	`paymentSchedule` text NOT NULL,
	CONSTRAINT `MortgageCalculation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `MortgageCalculation` ADD CONSTRAINT `MortgageCalculation_userId_Users_tgId_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`tgId`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `MortgageCalculation` ADD CONSTRAINT `MortgageCalculation_mortgageProfileId_MortgageProfile_id_fk` FOREIGN KEY (`mortgageProfileId`) REFERENCES `MortgageProfile`(`id`) ON DELETE cascade ON UPDATE no action;