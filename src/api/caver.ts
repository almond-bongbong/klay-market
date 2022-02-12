import Caver, { HttpProviderOptions } from 'caver-js';
import { KIP17_TOKEN_ABI } from '../abi/nft-abi';
import { concurrent, map, pipe, range, toArray, toAsync } from '@fxts/core';

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

// const StorageContract = new caver.contract(
//   STORAGE_ABI,
//   process.env.REACT_APP_STORAGE_CONTRACT_ADDRESS,
// );

const NFTContract = new caver.contract(
  KIP17_TOKEN_ABI,
  process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
);

export const getBalance = async (address: string) => {
  const response = await caver.rpc.klay.getBalance(address);
  return caver.utils.convertFromPeb(
    caver.utils.hexToNumberString(response),
    'KLAY',
  );
};

export const getNftListOf = async (address: string) => {
  // fetch balance
  const balance = await NFTContract.methods.balanceOf(address).call();

  // await NFTContract.methods.tokenByIndex(address).call();
  return pipe(
    range(balance),
    toAsync,
    map((index) =>
      NFTContract.methods.tokenOfOwnerByIndex(address, index).call(),
    ),
    map(async (tokenId) => ({
      tokenId,
      tokenURI: await NFTContract.methods.tokenURI(tokenId).call(),
    })),
    concurrent(10),
    toArray,
  );
};

export const mintCardWithURI = async (
  to: string,
  tokenId: string,
  uri: string,
) => {};

// export const readCount = () => StorageContract.methods.retrieve().call();

// export const storeCount = async (newValue: number) => {
//   const deployer = caver.wallet.keyring.createFromPrivateKey(
//     'address private key',
//   );
//   caver.wallet.add(deployer);
//
//   try {
//     const result = await StorageContract.methods.store(newValue).send({
//       from: deployer.address,
//       gas: '0x4bfd200',
//     });
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };
