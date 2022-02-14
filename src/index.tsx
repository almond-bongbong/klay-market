import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { BrowserRouter } from 'react-router-dom';
import { MyProvider } from './context/my-context';

console.log('NODE_ENV :', process.env.NODE_ENV);
console.log('KLAY_ACCESS_KEY :', process.env.REACT_APP_KLAY_ACCESS_KEY);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MyProvider>
        <App />
      </MyProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
