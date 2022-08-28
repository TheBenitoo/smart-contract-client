import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../../../utils/constants';
declare let require: any;
declare let window: any;
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  /*   web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/tTPOaOS9JB4yfjW7tsHwrRMdBNeV78R1');
   */
  /* private web3: Web3; */
  web3: any;
  accounts: any;
  account0: string;
  contract: any;
  transactionContract: any;
  contractAbi = contractABI;
  contractAddress = contractAddress;
  walletConnected: boolean = false;

  transactionCount: number;
  totalTransactions: any;
  mappedTransactions: [];

  amount: string;
  destination: string;
  message: string;
  keyword: string = 'Keyword';
  formData: { destination: string; amount: string; message: string };
  mapp: any;
  allTransactions: any;

  onMakeTransaction(form: NgForm) {
    this.destination = form.value.destination;
    this.amount = form.value.amount;
    this.message = form.value.message;
    console.log(form.value.destination);
    console.log(form.value.amount);
    console.log(form.value.message);

    this.makeTransaction1();
  }

  transactions: any = [
    {
      id: 'destinationAddress',
      type: 'text',
      formControl: 'destinationAddress',
      placeholder: 'Zieladresse',
    },
    {
      id: 'amount',
      type: 'number',
      formControl: 'amountEth',
      placeholder: 'Betrag (Eth)',
    },
  ];

  constructor(public contractService: ContractService) {
    this.web3 = new Web3(Web3.givenProvider);
    window.ethereum.on('accountsChanged', (accounts: any) => {
      this.accounts = this.web3.eth.getAccounts().then(function (acc: any) {
        accounts = acc;
      });
      this.accounts = accounts[0];
      console.log(accounts[0]);
    });
  }

  ngOnInit(): void {
    this.accounts = this.web3.eth.getAccounts().then(function (acc: any) {
      return acc[0];
    });

    /* this.isWalletConnected(); */

    this.contract = new this.web3.eth.Contract(
      this.contractAbi,
      this.contractAddress
    );

    this.transactionContract = this.createContract();

    /*     this.fetchValuesVersion1();
     */
    this.fetchValuesVersion2();
  }

  isWalletConnected() {
    if (window.ethereum) {
      this.walletConnected = true;
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      console.log(account);
      this.accounts = account;
      this.walletConnected = true;
    } else {
      window.alert(
        'Kein Ethereum Wallet gefunden. Lade dir MetaMask herunter!'
      );
      this.walletConnected = false;
    }
  }

  createContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return transactionsContract;
  }

  async onConnectWallet() {
    try {
      await this.loadWeb3();
      console.log(this.web3.eth.Contract);
      console.log(this.contractAbi);
      console.log(this.contractAddress);
      console.log(this.accounts);
      console.log(window.web3);
    } catch (err) {
      console.log(err);
    }
    /*     this.contractService.connectWallet();
     */
  }

  async sendTransaction() {
    try {
      /*       await this.contract.methods.addToBlockchain().send();
       */
    } catch (error) {}
  }

  async fetchValuesVersion1() {
    try {
      this.transactionCount = await this.contract.methods
        .getTransactionCount()
        .call();
      this.totalTransactions = await this.contract.methods
        .getAllTransactions()
        .call();
      console.log(this.transactionCount);
      console.log(this.totalTransactions);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchValuesVersion2() {
    try {
      this.transactionContract = this.createContract();
      const transactionsCount =
        await this.transactionContract.getTransactionCount();

      const allTransactions =
        await this.transactionContract.getAllTransactions();
      console.log(transactionsCount.toNumber());

      this.mapp = allTransactions.map((transaction: any) => {
        return {
          receiver: transaction.receiver,
          sender: transaction.sender,
          timestamp: transaction.timestamp,
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        };
      });
    } catch (error) {
      console.log('Wallet verbinden!');
    }
  }

  async makeTransaction1() {
    try {
      await this.loadWeb3();

      console.log('Make Transaction!');
      const parsedAmount = ethers.utils.parseEther(this.amount);
      console.log('Hello');
      console.log('Contract');
      console.log(this.destination);
      console.log(this.accounts);

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: this.accounts,
            to: this.destination,
            gas: '0x5208', //21.000 gwei
            value: parsedAmount._hex,
          },
        ],
      });

      await this.transactionContract.addToBlockchain(
        this.destination,
        parsedAmount,
        this.message,
        this.keyword
      );

      const transactionsCount =
        await this.transactionContract.getTransactionCount();
      console.log(transactionsCount.toNumber());
    } catch (error) {}
  }
}
