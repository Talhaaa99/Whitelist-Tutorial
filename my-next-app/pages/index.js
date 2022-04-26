import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants/index';

export default function Home() {
  const [numOfWhitelistedAddresses, setNumOfWhitelistedAddresses] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const{ chainId } = await web3Provider.getNetwork();
      if( chainId !== 4 ) {
        window.alert('Switch to Rinkeby Network');
        throw new Error('Switch to Rinkeby Network');
      }

      if(needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        await tx.wait();
        setLoading(false);
        await getNumOfWhitelisted();
        setJoinedWhitelist(true);
    } catch(err) {
      console.error(err);
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer =  getProviderOrSigner(true);
      const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
      );
    const address = await signer.getAddress();
    const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
      address
      );
    setJoinedWhitelist(_joinedWhitelist);
  } catch(err) {
    console.error(err);
  }
  }

  const getNumOfWhitelisted = async () => {
    try {
    const provider = await getProviderOrSigner();
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      provider
      );
    const _numOfWhitelisted = await whitelistContract.numWhitelistedAddresses();
    setNumOfWhitelistedAddresses(_numOfWhitelisted);
    } catch(err) {
      console.error(err);
    }

  }



  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumOfWhitelisted();
    } catch(err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if(walletConnected) {
      if(joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining!
          </div>
        );
      }  else if(loading) {
        return (
          <button className={styles.button}>
            Loading...
          </button>
        )
    } 
      else { 
        return (
        <button onClick={addAddressToWhitelist} className={styles.button}>
          Join the Whitelist pls
        </button>
        )
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
        Connect Wallet
        </button>
      );
    }
  }

  useEffect(() => {
    if (!walletConnected) {      
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
        {renderButton()}
      <div>
        <img className={styles.image} src='./talha-illust.jpg'/>
      </div>
    </div>

     <footer className={styles.footer}>
      Made by a noob 🤌
     </footer>
   </div>
  );
}
