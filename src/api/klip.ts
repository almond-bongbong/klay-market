import Caver, { HttpProviderOptions } from 'caver-js';
import { STORAGE_ABI } from '../abi/storage-abi';

const options: HttpProviderOptions = {
  headers: [
    {
      name: 'Authorization',
      value: `Basic ${window.btoa(
        `${process.env.REACT_APP_KLAY_ACCESS_KEY}:${process.env.REACT_APP_KLAY_SECRET_KEY}`,
      )}`,
    },
    {
      name: 'x-chain-id',
      value: process.env.REACT_APP_CHAIN_ID,
    },
  ],
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    'https://node-api.klaytnapi.com/v1/klaytn',
    options,
  ),
);
const StorageContract = new caver.contract(
  STORAGE_ABI,
  process.env.REACT_APP_STORAGE_CONTRACT_ADDRESS,
);

export const readCount = async () => {
  const value = await StorageContract.methods.retrieve().call();
  console.log(value);
};

export const getBalance = async (address: string) => {
  const response = await caver.rpc.klay.getBalance(address);
  return caver.utils.convertFromPeb(
    caver.utils.hexToNumberString(response),
    'KLAY',
  );
};

export const storeCount = async (newValue: number) => {
  const deployer = caver.wallet.keyring.createFromPrivateKey(
    'address private key',
  );
  caver.wallet.add(deployer);

  try {
    const result = await StorageContract.methods.store(newValue).send({
      from: deployer.address,
      gas: '0x4bfd200',
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
