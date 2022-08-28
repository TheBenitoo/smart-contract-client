declare var window: any
import { Injectable } from '@angular/core';
import {contractABI, contractAddress} from "../../utils/constants"

const {ethereum} = window;


@Injectable({providedIn: 'root'})
export class ContractService{
    constructor() {}

    connectWallet() {
        console.log("H");
  };
}
