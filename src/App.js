import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import bctest from "./bctest";

class App extends Component {
  state = {
    amount: "",
    message: "",
    address: "",
    balance: "",
    targetAdd: ""
  };

  async componentDidMount() {
    const address = await bctest.options.address;
    const balance = await bctest.methods
      .balanceOf(bctest.options.address)
      .call();
    this.setState({ address, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const myAddress = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success.." });
    await bctest.methods.getCoins().send({ gas: "700000", from: myAddress[0] });
    this.setState({ message: "Success - Check your balance" });
  };

  render() {
    return (
      <div>
        <h2>Would you like some BurgerCoinTest tokens?</h2>
        <ul>
          <li>BurgerCoinTest contract is deployed at: {this.state.address}</li>
          <li>Decimcals: 18</li>
          <li>Symbol: BCT</li>
        </ul>

        <hr />

        <form onSubmit={this.onSubmit}>
          <div>
            <p>Amount of coins available: {this.state.balance} </p>
          </div>
          <button>Get Tokens!</button>
          <hr />
          <h1>{this.state.message}</h1>
        </form>
      </div>
    );
  }
}

export default App;
