import { ApiProperty } from '@nestjs/swagger';

export class CreateMortgageProfileResponseDto {
  @ApiProperty({ example: '1' })
  id: string;
}
