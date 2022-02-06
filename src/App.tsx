import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import './App.css';
import useKlip from './hook/useKlip';
import { getBalance, readCount } from './api/caver';

function App() {
  const { authRequestUrl, getKlipAddress, storeValue } = useKlip();
  const [balance, setBalance] = useState('');
  const [store, setStore] = useState('');

  useEffect(() => {
    readCount().then(setStore);
  }, []);

  const handleGetAddressClick = async () => {
    const data = await getKlipAddress();
    const klayBalance = await getBalance(data.result.klaytn_address);
    setBalance(klayBalance);
  };

  const handleStoreValueClick = async () => {
    await storeValue(100);
    const count = await readCount();
    setStore(count);
  };

  return (
    <div className="App">
      <header className="App-header">
        {authRequestUrl && <QRCode value={authRequestUrl} />}
        <br />
        <button type="button" onClick={handleGetAddressClick}>
          주소 가져오기
        </button>
        <br />
        balance : {balance}
        <br />
        <br />
        <button type="button" onClick={handleStoreValueClick}>
          스마트 컨트랙트 트랜잭션 실행
        </button>
        <br />
        store : {store}
      </header>
    </div>
  );
}

export default App;
