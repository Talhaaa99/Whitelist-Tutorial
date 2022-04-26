import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react';
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";

export default function Home() {
  const [numOfWhitelistedAddresses, setNumOfWhitelistedAddresses] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();


  const getProviderOrSigner = async(needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.web3Provider(provider);

      const{chainId} = await web3Provider.getNetwork();
      if( chainId !== 4 ) {
        window.error('Switch to Rinkeby Network');
        throw new err('Switch to Rinkeby Network');
      }

      if(needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider
    } catch(err) {
      console.error(err);
    }
  }

  const checkIfAddressIsWhitelistd = async () {
    await getProviderOrSigner(true);
    const whitelistContract = Contract {
      
    }
  }


  const connectWallet = async() => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelistd();
      numOfWhitelistedAddresses();
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
   <div>
     <Head>
      <title>Whitelist Dapp</title>
      <meta name='description' content='This is a whitelist dapp' />
     </Head>
    
    <div className={styles.main}>
      <h1 className={styles.title}>Welcome to crypto devs!</h1>
      <div className={styles.description}>
        {numOfWhitelistedAddresses} have already joined the whitelist :p 
      </div>
      <div>
        <img className={styles.image} src='./crypto-devs.svg'/>
      </div>
    </div>

     <footer className={styles.footer}>
      Made by Talha 🤌
     </footer>
   </div>
  )
}
