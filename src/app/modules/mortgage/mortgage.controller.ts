import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import {
  CreateMortgageProfileDto,
  CreateMortgageProfileResponseDto,
  MortgageCalculationResponseDto
} from './dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('mortgage')
@Controller()
export class MortgageController {
  constructor(private readonly mortgageService: MortgageService) {}

  @ApiOperation({ summary: 'Создание нового ипотечного расчета' })
  @ApiCreatedResponse({ type: CreateMortgageProfileResponseDto })
  @Post('mortgage-profiles')
  createMortgageProfile(
    @Body() createMortgageProfileDto: CreateMortgageProfileDto
  ): Promise<CreateMortgageProfileResponseDto> {
    return this.mortgageService.createMortgageProfile(createMortgageProfileDto);
  }

  @ApiOperation({ summary: 'Получение информации об ипотечном расчете' })
  @ApiOkResponse({ type: MortgageCalculationResponseDto })
  @Get('mortgage-profiles/:id')
  getMortgageProfile(
    @Param('id') id: string
  ): Promise<MortgageCalculationResponseDto> {
    return this.mortgageService.getMortgageProfile(id);
  }
}
