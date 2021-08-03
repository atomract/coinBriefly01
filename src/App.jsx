import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Networks from 'constants/networks';
import BN from 'bignumber.js';

import './App.css';
import img from './img.svg';

// import { connectWallet } from 'features/connectWallet.js';

function SecondTitle({ isInjected, connected, networkId }) {
  const network = Networks[networkId];

  if (isInjected == false) {
    return <em>Metamask Required</em>;
  } else if (isInjected == true && connected == false) {
    return <em>Please connect Metamask</em>;
  } else if (isInjected == true && connected == true) {
    if (network) {
      return <em>Connected</em>;
    } else {
      return <em>Unsupported network</em>;
    }
  }
}

function SecondData({ isInjected, connected, address, networkId }) {
  const network = Networks[networkId];
  if (isInjected == false) {
    return <em>non-ethereum browser, consider installing metamask.</em>;
  } else if (isInjected == true && connected == false) {
    return <em></em>;
  } else if (isInjected == true && connected == true) {
    if (network) {
      return <p>Connected as {address}</p>;
    } else {
      return null;
    }
  }
}

function SendButtons({ connected, networkId }) {
  const network = Networks[networkId];
  if (connected == true && network) {
    return (
      <h4 className='send'>
        send{' '}
        <em>
          <a
            className='text'
            data-bs-toggle='collapse'
            href='#collapseExample'
            role='button'
            aria-expanded='false'
          >
            {network.symbol.toLowerCase()}
          </a>
        </em>{' '}
        or{' '}
        <em>
          <a
            className='text'
            data-bs-toggle='collapse'
            href='#collapseExample'
            role='button'
            aria-expanded='false'
          >
            {' '}
            token
          </a>
        </em>
      </h4>
    );
  } else {
    return null;
  }
}

function HeaderExtras({ connected, networkId }) {
  const network = Networks[networkId];
  if (connected == true && network) {
    return (
      <div>
        <a className='etherscan  ms-4' href={network.explorer.url} target='_blank'>
          {network.explorer.name}
        </a>
        <a className='telegram ms-4' href='#'>
          telegram
        </a>
      </div>
    );
  } else {
    return (
      <div>
        <a className='etherscan  ms-4' href='#'></a>
        <a className='telegram ms-4' href='#'>
          telegram
        </a>
      </div>
    );
  }
}

function CollapseCard({ networkId, mainBalance, handleChange, textArea }) {
  const network = Networks[networkId];
  if (network) {
    console.log('in collapse network');
    return (
      <div className='collapse' id='collapseExample'>
        <p className='ETH pt-4 smFont'>
          you have {Number(mainBalance).toFixed(4)} {network?.symbol}
        </p>
        <div>
          <h2 className='amounts'>
            <em>recipients and amounts</em>
          </h2>
        </div>
        <div>
          <p className='line pt-3'>
            enter one address and amount in ETH on each line. supports any format.
          </p>
        </div>
        <div className='d-flex flex-row justify-content-between' style={{marginLeft: '6%'}}>
          <textarea
            onChange={handleChange}
            useRef='addresses'
            spellcheck='false'
            placeholder='0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592
0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.7182
0x141ca95b6177615fb1417cf70e930e102bf8f584=1.41421'
            value={textArea}
          ></textarea>
        </div>
      </div>
    );
  } else return null;
}

function App() {
  const [isInjected, setInjected] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [networkId, setNetworkId] = useState(0);
  const [mainBalance, setMainBalance] = useState(0);
  const [textArea, setTextArea] = useState('');

  const network = Networks[networkId];
  console.log(network);

  function handleChange(e) {
    setTextArea(e.target.value);
    console.log(textArea.split('\n'));
  }

  async function connectWallet(provider) {
    const web3 = new Web3(provider);
    setWeb3(web3);

    //Extend method to convert chainId from Hex to number
    web3.eth.extend({
      methods: [{ name: 'chainId', call: 'eth_chainId', outputFormatter: web3.utils.hexToNumber }],
    });

    provider.on('close', () => {
      console.log('Got into close');
      setConnected(false);
    });
    provider.on('disconnect', async () => {
      console.log('Got into disconnect');
      setConnected(false);
    });
    provider.on('connect', async () => {
      console.log('Got into connected');
      setConnected(true);
    });
    provider.on('accountsChanged', async (accounts) => {
      console.log('Got into accountsChanged');
      if (accounts[0]) {
        setAddress(accounts[0]);
      } else {
        setAddress(0);
        setConnected(false);
      }
    });

    provider.on('chainChanged', async (chainId) => {
      console.log('Got into chainChanged');
      chainId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
      setNetworkId(chainId);
    });

    const accounts = await web3.eth.requestAccounts();
    const address = accounts[0];
    const networkId = await web3.eth.getChainId();
    setConnected(true);
    setNetworkId(networkId);
    setAddress(address);
  }

  function fromDecimal(number, decimals) {
    if (BN.isBigNumber(number)) {
      return number.div(new BN(10).pow(new BN(decimals))).toString();
    } else {
      return new BN(number).div(new BN(10).pow(new BN(decimals))).toString();
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      setInjected(true);
      connectWallet(window.ethereum);
    }
  }, []);

  useEffect(async () => {
    if (address) {
      console.log('got into address useeffect');
      const balance = await web3.eth.getBalance(address);
      const sanitizedMainbalance = fromDecimal(balance, 18);
      // console.log();
      setMainBalance(sanitizedMainbalance);
    }
  }, [address, networkId]);

  return (
    <div 
    className='mainContainer'
    >
      <div className='container '>
        <div className='row'>
          <div className='col-md-8 mx-auto'>
            <div className='d-flex navBar'>
              <div className='svglogo'>
                <img src={img} />
              </div>

              <h1 className='dis'>
                scatter <sup className='mai'>mainnet</sup>
              </h1>
              <HeaderExtras {...{ connected, networkId }} />
            </div>

            <p className='mt-3 verbline'>
              <em>verb</em> distribute ether or tokens to multiple addresses
            </p>
            <div>
              <h2 className='connect'>
                <SecondTitle {...{ isInjected, connected, networkId }} />
              </h2>
              <p className='logged'>
                <SecondData {...{ isInjected, connected, networkId, address }} />
              </p>
            </div>
            <SendButtons {...{ connected, networkId }} />
            <CollapseCard
              {...{ connected, mainBalance, network, networkId, handleChange, textArea }}
            />
            <div className='confirmCon'>
              <div>
                <div className='conFont'>
                  <em>confirm</em>
                </div>
                <div className='d-flex flex-row justify-content-between'> 
                  <em>address</em>
                  <em>amount</em>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                  <p className='avFont'>
                  0xB404c51BBC10dcBE948077F18a4B8E553D160084 -
                  </p>
                  <p className='avFont'>
                    0.001 ETH
                  </p>
                </div>
                <div>
                  <div className='d-flex flex-row justify-content-between'>
                    <em>
                      total
                    </em>
                    <em>
                      0.001ETH
                    </em>
                  </div>
                  <div className='d-flex flex-row justify-content-between'>
                    <em>
                      your balance
                    </em>
                    <em>
                      0.001ETH
                    </em>
                  </div>
                  <div className='d-flex flex-row justify-content-between'>
                    <em>
                      remaining
                    </em>
                    <em>
                      0.001ETH
                    </em>
                  </div>
                </div>
                <button className='etherbtn'>
                  <em>
                  Scatter ether
                  </em>
                </button>
                <div className='avFont'>
                  <em>
                    token address
                  </em>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <textarea
                      className='tokenTextArea'
                      placeholder='0x314ab97b76e39d63c78d5c86c2daf8eaa306b182'
                    ></textarea>
                  <div>
                    <button className='etherbtn'>
                      <em>
                      load
                      </em>
                    </button>
                  </div>
                </div>
                <div className='smFont'>
                  <p>you have 0.0 USDT (USDT Coin)</p>
                </div>
                <br/>
                <br/>
                <br/>
                <div>
                  <p className='conFont'>
                    <em>
                      recipients and amounts
                    </em>
                  </p>
                </div>
                <div>
                  <p className='smFont'>
                    enter one address and amount in USDT on each line. supports any format.
                  </p>
                </div>
                <div style={{marginBottom: '10%', marginRight: '16%'}}>
                  <textarea
                    placeholder='0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592
                      0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.7182
                      0x141ca95b6177615fb1417cf70e930e102bf8f584=1.41421'
                  ></textarea>
                </div>
                <div className='conFont'>
                  <em>confirm</em>
                </div>
                <br/>
                <div className='d-flex flex-row justify-content-between'> 
                  <em>address</em>
                  <em>amount</em>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                  <p className='avFont'>
                  0xB404c51BBC10dcBE948077F18a4B8E553D160084 -
                  </p>
                  <p className='avFont'>
                    0.001 ETH
                  </p>
                </div>
                <div>
                  <div className='d-flex flex-row justify-content-between'>
                    <em>
                      total
                    </em>
                    <em>
                      0.001ETH
                    </em>
                  </div>
                  <div className='d-flex flex-row justify-content-between'>
                    <em>
                      your balance
                    </em>
                    <em>
                      0.001ETH
                    </em>
                  </div>
                  <div className='d-flex flex-row justify-content-between' style={{marginBottom: '10%', color: 'red'}}>
                    <em>
                      remaining
                    </em>
                    <em>
                      -0.001ETH
                    </em>
                  </div>
                  <div className='conFont'>
                  <em>allowence</em>
                  </div>
                  <div className='smFont'>
                    <p>
                      allow smart contract to transfer tokens on your behalf.
                    </p>
                  </div>
                    <button className='approvebtn'>
                      <em>
                      approve
                      </em>
                    </button>
                    <div style={{marginTop: '3%', marginBottom: '13.5%'}} className= 'd-flex flex-row'>
                      <button className='approvebtn'>
                        <em>
                        disperse token
                        </em>
                      </button>
                      <div style={{marginLeft: '3%', marginTop: '1%'}}>
                        <em> needs allowence</em>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
