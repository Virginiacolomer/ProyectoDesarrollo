import { IsOptional, IsString, IsObject } from 'class-validator';

export class partialUpdateOrderDto {
  @IsOptional()
  @IsString()
  status: string;
}
