import { IsNumber, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDetailDto {
    @IsString()
    @IsNotEmpty()
    paymentStatus: string;
}

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    method: string;


    //Se crea el CreatePaymentDetailDto con los datos que estaban en ese campo en el JSON
    @ValidateNested()
    @Type(() => CreatePaymentDetailDto)
    transactionDetails: CreatePaymentDetailDto;
}
