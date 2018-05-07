import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import bctest from "./bctest";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      message: "",
      address: "",
      balance: "",
      targetAdd: "",
      emailAddy: ""
    };
    this.updateState = this.updateState.bind(this);
      
  };

  async componentDidMount() {
    const address = await bctest.options.address;
    const balance = await bctest.methods
      .balanceOf(bctest.options.address)
      .call();
    this.setState({ address, balance });
  }

  updateState(e) {
    this.setState({emailAddy: e.target.value});
  };

  onSubmit = async event => {
    event.preventDefault();
    console.log("in onSubmit function");
    console.log(this.state.emailAddy);
    var emailAddress = this.state.emailAddy;
    var emailDomain = emailAddress.replace(/.*@/, "");
    console.log(emailDomain);
    if (emailDomain == "oregonstate.edu") {
      fetch('https://my-project-1514223225812.appspot.com/account', {
        method: 'get'
        }).then(res => console.log(res));
      const myAddress = await web3.eth.getAccounts();
      this.setState({ message: "Waiting on transaction success.." });
      await bctest.methods.getCoins().send({ gas: "700000", from: myAddress[0] });
      this.setState({ message: "Success - Check your balance" });
    }
    else {
      this.setState({ message: "I'm sorry, we are only giving tokens to *@oregonstate.edu addresses right now..." });
    }
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
          <label>
            Email Address:
            <input type="text" value={this.state.emailAddy} onChange={this.updateState} />
          </label>
          <hr />
          <button>Get Tokens!</button>
          <hr />
          <h1>{this.state.message}</h1>
        </form>
      </div>
    );
  }
}

export default App;
