import axios from 'axios';
import { delay } from '../lib/util';
import { STORAGE_ABI } from '../abi/storage-abi';

const APP_NAME = 'KLAY_MARKET';

interface Result {
  request_key: string;
  expiration_time: number;
  status: string;
  result: {
    klaytn_address: string;
  };
}

export const getResult = async (requestKey: string): Promise<Result> => {
  const { data } = await axios.get(
    `https://a2a-api.klipwallet.com/v2/a2a/result`,
    {
      params: {
        request_key: requestKey,
        ts: new Date(),
      },
    },
  );
  if (data.result?.status === 'success') {
    return data;
  }

  await delay(1000);
  return getResult(requestKey);
};

export const prepareKlipAuth = () =>
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
    bapp: {
      name: APP_NAME,
    },
    type: 'auth',
  });

export const prepareExecuteStoreContract = (storeValue: number) =>
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
    bapp: {
      name: APP_NAME,
    },
    type: 'execute_contract',
    transaction: {
      to: process.env.REACT_APP_STORAGE_CONTRACT_ADDRESS,
      abi: JSON.stringify(STORAGE_ABI[0]),
      value: '0',
      params: `["${storeValue}"]`,
    },
  });
