import { IsBoolean, IsEnum, IsNumber, Min, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../types/mortgage.types';

export class CreateMortgageProfileDto {
  @ApiProperty({ example: 5000000, description: 'Стоимость недвижимости' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  propertyPrice: number;

  @ApiProperty({
    enum: PropertyType,
    example: PropertyType.APARTMENT_IN_NEW_BUILDING
  })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 1000000, description: 'Первоначальный взнос' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  downPaymentAmount: number;

  @ApiPropertyOptional({
    example: 0,
    nullable: true,
    description: 'Сумма маткапитала'
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  matCapitalAmount: number | null;

  @ApiProperty({
    example: false,
    description: 'Учитывать маткапитал в расчете'
  })
  @IsBoolean()
  matCapitalIncluded: boolean;

  @ApiProperty({ example: 20, description: 'Срок ипотеки в годах' })
  @IsNumber()
  @Min(0)
  mortgageTermYears: number;

  @ApiProperty({ example: 12.5, description: 'Годовая процентная ставка' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  interestRate: number;
}
