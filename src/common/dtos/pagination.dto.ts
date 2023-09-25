import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginatioDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @IsPositive()
    limit?: number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;
}