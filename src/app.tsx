import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Market from './page/market';
import Mint from './page/mint';
import Wallet from './page/wallet';
import { MyProvider } from './context/my-context';

function App() {
  const { pathname } = useLocation();
  const [, firstPath] = pathname.split('/');

  return (
    <MyProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Menu mode="horizontal" selectedKeys={[firstPath]}>
          <Menu.Item key="">
            <Link to="/">Market</Link>
          </Menu.Item>
          <Menu.Item key="mint">
            <Link to="/mint">Mint</Link>
          </Menu.Item>
          <Menu.Item key="wallet">
            <Link to="wallet">Wallet</Link>
          </Menu.Item>
        </Menu>

        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Layout>
    </MyProvider>
  );
}

export default App;
