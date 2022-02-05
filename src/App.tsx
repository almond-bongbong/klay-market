import React from 'react';
import './App.css';
import { readCount, storeCount } from './api/klip';

function App() {
  readCount();
  // getBalance('0x9e97a0d60Cfd4e1bb69D001C998d306541412359').then(console.log);

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={() => storeCount(10)}>
          store count
        </button>
      </header>
    </div>
  );
}

export default App;
