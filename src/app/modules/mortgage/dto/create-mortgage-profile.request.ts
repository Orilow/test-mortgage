import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../types/mortgage.types';


export class CreateMortgageProfileDto {
  @ApiProperty({ example: 5000000, description: 'Стоимость недвижимости' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  propertyPrice: number;

  @ApiProperty({ enum: PropertyType, example: PropertyType.APARTMENT_IN_NEW_BUILDING })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 1000000, description: 'Первоначальный взнос' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  downPaymentAmount: number;

  @ApiPropertyOptional({ example: 0, nullable: true, description: 'Сумма маткапитала' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  matCapitalAmount: number | null;

  @ApiProperty({ example: false, description: 'Учитывать маткапитал в расчете' })
  @IsBoolean()
  matCapitalIncluded: boolean;

  @ApiProperty({ example: 20, description: 'Срок ипотеки в годах' })
  @IsNumber()
  @IsPositive()
  mortgageTermYears: number;

  @ApiProperty({ example: 12.5, description: 'Годовая процентная ставка' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  interestRate: number;
}
