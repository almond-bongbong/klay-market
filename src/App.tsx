import React from 'react';
import logo from './logo.svg';
import './App.css';
import Caver, { AbiItem, HttpProviderOptions } from 'caver-js';

const STORAGE_CONTRACT_ADDRESS =
  process.env.REACT_APP_STORAGE_CONTRACT_ADDRESS ?? '';
const ACCESS_KEY = process.env.REACT_APP_KLAY_ACCESS_KEY ?? '';
const SECRET_KEY = process.env.REACT_APP_KLAY_SECRET_KEY ?? '';
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID ?? '';
const STORAGE_ABI: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'num',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'retrieve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const options: HttpProviderOptions = {
  headers: [
    {
      name: 'Authorization',
      value: `Basic ${window.btoa(ACCESS_KEY + SECRET_KEY)}`,
    },
    {
      name: 'x-chain-id',
      value: CHAIN_ID,
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
  STORAGE_CONTRACT_ADDRESS,
);

const readCount = async () => {
  const value = await StorageContract.methods.retrieve().call();
  console.log(value);
};

function App() {
  // readCount();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
