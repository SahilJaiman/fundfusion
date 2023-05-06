"use client";
import React, { useState, useEffect } from 'react';
import { connectWallet, getAccount } from '@/utils/wallet';
import { ConfigProvider, theme } from 'antd';
import { Tooltip } from 'antd';

export default function ConnectWallet() {

  const [account, setAccount] = useState(null);

  useEffect(() => {
    (async () => {
      const activeAccount = await getAccount();

      setAccount(activeAccount);
    })();


  }, []);

  const onConnectWallet = async () => {
    await connectWallet();
    const activeAccount = await getAccount();
    setAccount(activeAccount);
  };


  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className=''>
        {
          account ? (
            <Tooltip placement="top" title={"Go to Profile"}>
              <button onClick={onConnectWallet} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 duration-200 transition ease-out hover:scale-[1.02]">
                <img className='w-4 h-4 md:mr-2' src='/tezos.svg' />
                <span className=' hidden md:block'>{account.slice(0, 5) + " ... " + account.slice(-4)}</span>
              </button>
            </Tooltip>
          ) :

            (<button onClick={onConnectWallet} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 duration-200 transition ease-out hover:scale-[1.02]">
              <img className='w-4 h-4 md:mr-2' src='/tezos.svg' />
              <span className='hidden md:block'>Connect Wallet</span>
            </button>
            )}

      </div >
    </ConfigProvider>

  )
}
