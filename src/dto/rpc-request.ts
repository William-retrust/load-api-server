import { Transform } from 'class-transformer';

export class RpcMessageParameters {
  @Transform((string_) => String(string_.value).toLowerCase())
  from?: string;

  @Transform((string_) => String(string_.value).toLowerCase())
  to?: string;

  value?: string;

  gas?: string;

  gasPrice?: string;

  data?: string;
}

export class RpcMessage {
  jsonrpc: string;
  method: string;
  params: (RpcMessageParameters | string)[];
  id: number;
}
