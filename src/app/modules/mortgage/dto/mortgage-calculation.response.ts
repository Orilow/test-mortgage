import { ApiProperty } from '@nestjs/swagger';

export class MortgageCalculationResponseDto {
  @ApiProperty({ example: '45446' })
  monthlyPayment: string;

  @ApiProperty({ example: '10906949' })
  totalPayment: string;

  @ApiProperty({ example: '6906949' })
  totalOverpaymentAmount: string;

  @ApiProperty({ example: '650000' })
  possibleTaxDeduction: string;

  @ApiProperty({ example: '0' })
  savingsDueMotherCapital: string;

  @ApiProperty({ example: '72713' })
  recommendedIncome: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      '1': {
        '1': {
          totalPayment: 45445.62,
          repaymentOfMortgageBody: 3778.95,
          repaymentOfMortgageInterest: 41666.67,
          mortgageBalance: 3996221.05
        }
      }
    }
  })
  mortgagePaymentSchedule: Record<string, unknown>;
}
