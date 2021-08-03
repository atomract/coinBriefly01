import Web3 from 'web3';

export async function connectWallet(provider) {
  const web3 = new Web3(provider);

  //Extend method to convert chainId from Hex to number
  web3.eth.extend({
    methods: [{ name: 'chainId', call: 'eth_chainId', outputFormatter: web3.utils.hexToNumber }],
  });

  const accounts = await web3.eth.requestAccounts();
  const address = accounts[0];
  const networkId = await web3.eth.getChainId();
  console.log(accounts);

  return { web3, address, networkId };
}
