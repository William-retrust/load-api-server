import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RpcError {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  message: string;
}

export class RpcResponse {
  @ApiProperty()
  @IsString()
  jsonrpc: string;

  @ApiProperty()
  result?: never;

  @ApiProperty()
  error?: RpcError;

  @ApiProperty()
  @IsNumber()
  id: number;
}
