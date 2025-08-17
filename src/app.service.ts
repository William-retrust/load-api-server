import { Injectable } from '@nestjs/common';
import { BigNumber, Contract, ethers, providers, Wallet } from 'ethers';
import { HttpService } from '@nestjs/axios';
import { RpcMessage } from './dto/rpc-request';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { RpcResponse } from './dto/rpc-response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private static nonce;
  private readonly toAddress;
  private readonly tokenAddress;
  private ownerAddress;
  private readonly ownerPrivateKey;
  private readonly url;
  private readonly provider: providers.JsonRpcProvider;
  private readonly wallet: Wallet;
  private readonly erc20Contract: Contract;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.toAddress = this.configService.get<string>('TO_ADDRESS');
    this.tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
    this.ownerPrivateKey = this.configService.get<string>('OWNER_PRIV_KEY');
    this.url = this.configService.get<string>('RPC_URL');

    this.provider = new ethers.providers.JsonRpcProvider(this.url);
    this.wallet = new Wallet(this.ownerPrivateKey, this.provider);
    this.erc20Contract = new ethers.Contract(
      this.tokenAddress,
      [
        // Include ABI of the ERC20 contract here
        // For example:
        'function transfer(address to, uint256 value) returns (bool)',
      ],
      this.wallet,
    );
    AppService.nonce = 0;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getNonce() {
    if (AppService.nonce === 0) {
      AppService.nonce = await this.wallet.getTransactionCount();
    }
    return AppService.nonce++;
  }

  async sendTx(): Promise<string> {
    const nonce = await this.getNonce();

    const rawTransaction = {
      nonce: ethers.utils.hexlify(nonce),
      gasPrice: BigNumber.from(250000000000000).toHexString(),
      gasLimit: BigNumber.from(510000).toHexString(),
      to: this.erc20Contract.address,
      value: '0x0',
      data: this.erc20Contract.interface.encodeFunctionData('transfer', [
        this.toAddress,
        ethers.utils.parseUnits('1', 0),
      ]),
      chainId: +BigNumber.from(1027).toHexString(),
    };

    const signedTx = await this.wallet.signTransaction(rawTransaction);

    return await this.executeTransaction(this.url, signedTx);
  }

  generateReqId(): number {
    const hrTime = process.hrtime();
    return hrTime[0] * 1_000_000_000 + hrTime[1];
  }

  async executeTransaction(
    url: string,
    signedTransaction: string,
  ): Promise<string> {
    const message: RpcMessage = {
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [signedTransaction],
      id: this.generateReqId(),
    };

    let response: undefined | AxiosResponse<RpcResponse>;
    try {
      response = (await lastValueFrom(
        this.httpService.post<RpcResponse>(url, message),
      )) as AxiosResponse<RpcResponse>;
    } catch (error: unknown) {
      console.log(error);
    }
    if (response.data.error) {
      console.log(response.data.error.message);
      throw Error(response.data.error.message);
    }
    return response.data.result;
  }
}
