import axios from 'axios';
import { delay } from '../lib/util';

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
  if (data.result) {
    return data.result;
  }

  await delay(1000);
  return getResult(requestKey);
};

export const prepareKlipAuth = () =>
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
    bapp: {
      name: 'KLAY_MARKET',
    },
    type: 'auth',
  });
