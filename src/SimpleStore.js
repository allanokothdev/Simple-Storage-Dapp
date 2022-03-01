import { ethers } from "ethers";
import React, { useState} from "react";
import SimpleStore_abi from './SimpleStore_abi';

const SimpleStore = () => {

    const contractAddress = "0x3d302c9D493778bF6D1512F8C2E106CC850a21b1";

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangeHandler(result[0]);
                setConnButtonText('Wallet Connected')
            })
        } else {
            setErrorMessage('Need to install metamask');
        }
    }

    const accountChangeHandler = (newAccount) => {
         setDefaultAccount(newAccount);
         updateEthers();
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner);
        setContract(tempContract);
    }

    const getCurrentValue = async () => {
        let val = await contract.get();
        setCurrentContractVal(val);
    }

    const setHandler = (event) => {
        event.preventDefault();
        contract.set(event.target.setText.value);
    }

    return (
        <div>
            <h3>{"Get/Set Interaction with our Contract"}</h3>
            <button onClick={connectWalletHandler}> {connButtonText}</button>
            <h3> Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id ='setText' type="text"/>
                <button type={"submit"}>Update Contract</button>
            </form>

            <button onClick={getCurrentValue}> Get Current Value</button>
            {currentContractVal}
            (errorMessage)
        </div>
    )
}

export default SimpleStore;