import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Market from './page/market';
import Mint from './page/mint';
import Wallet from './page/wallet';
import { useMyContext } from './context/my-context';
import { ME_STORAGE_KEY } from './constant/key';

function App() {
  const { pathname } = useLocation();
  const [, firstPath] = pathname.split('/');
  const { setMe } = useMyContext();
  const savedMeString = localStorage.getItem(ME_STORAGE_KEY) || 'null';
  const savedMe = useMemo(() => JSON.parse(savedMeString), [savedMeString]);
  const [initMe, setInitMe] = useState(false);

  useLayoutEffect(() => {
    if (savedMe) setMe(savedMe);
    setInitMe(true);
  }, [savedMe, setMe]);

  if (!initMe) return null;

  return (
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
  );
}

export default App;
