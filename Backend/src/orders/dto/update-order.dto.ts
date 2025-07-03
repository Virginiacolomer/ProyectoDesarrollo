import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status: string;

  //any porque no es en una entidad en nuestro dominio
  @IsOptional()
  @IsObject()
  location: any;
}
