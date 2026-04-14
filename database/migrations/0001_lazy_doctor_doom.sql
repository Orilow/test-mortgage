CREATE TABLE `MortgageProfile` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`propertyPrice` decimal NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`downPaymentAmount` decimal NOT NULL,
	`matCapitalAmount` decimal,
	`matCapitalIncluded` boolean NOT NULL,
	`mortgageTermYears` int NOT NULL,
	`interestRate` decimal NOT NULL,
	CONSTRAINT `MortgageProfile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `MortgageProfile` ADD CONSTRAINT `MortgageProfile_userId_Users_tgId_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`tgId`) ON DELETE restrict ON UPDATE no action;