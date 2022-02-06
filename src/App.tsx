import React from 'react';
import QRCode from 'qrcode.react';
import './App.css';
import useKlip from './hook/useKlip';

function App() {
  // readCount();
  // getBalance('0x9e97a0d60Cfd4e1bb69D001C998d306541412359').then(console.log);
  const { getKlipAddress, authRequestUrl } = useKlip();

  const handleGetAddressClick = async () => {
    const result = await getKlipAddress();
    console.log(result);
  };

  return (
    <div className="App">
      <header className="App-header">
        {authRequestUrl && <QRCode value={authRequestUrl} />}
        <br />
        <button type="button" onClick={handleGetAddressClick}>
          주소 가져오기
        </button>
      </header>
    </div>
  );
}

export default App;
