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
      emailAddy: "",
      transferee: "",
      transferAmount: ""
    };
    this.updateState = this.updateState.bind(this);
    this.updateTransferee = this.updateTransferee.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    // this.checkcurrent = this.checkcurrent.bind(this);  
  };

  async componentDidMount() {
    const address = await bctest.options.address;
    const balance = await bctest.methods
      .balanceOf(bctest.options.address)
      .call();
    this.setState({ address, balance });
    const myAddress1 = await web3.eth.getAccounts();
    console.log(myAddress1);
    const myBalance = await bctest.methods
      .balanceOf(bctest.options.myAddress1)
      .call();
    console.log(myBalance);
  }

  updateState(e) {
    this.setState({emailAddy: e.target.value});
  };
  
  updateTransferee(r) {
    this.setState({ transferee: r.target.value });
  };
  
  updateAmount(q) {
    this.setState({ transferAmount: q.target.value });
  };

  onSubmit = async event => {
    event.preventDefault();
    //console.log("in onSubmit function");
    //console.log(this.state.emailAddy);
    var emailAddress = this.state.emailAddy;
    var emailDomain = emailAddress.replace(/.*@/, "");
    //console.log(emailDomain);
    var this1 = this;
    //  CHECK1 - Email address has an oregonstate.edu domain
    if (emailDomain == "oregonstate.edu") {
      // check the current list of email addresses
      var checkcurrent = new XMLHttpRequest();
      checkcurrent.open('GET', 'https://my-project-1514223225812.appspot.com/account', true);
      // If specified, responseType must be empty string or "text"
      checkcurrent.responseType = 'text';
      checkcurrent.onload = async function () {
        if (checkcurrent.readyState === checkcurrent.DONE) {
          if (checkcurrent.status === 200) {
            //console.log(checkcurrent.response);
            // console.log(xhr.responseText);
            var current_list = JSON.parse(checkcurrent.response);
            //console.log(current_list);
            var already_exists = 0;
            for (var address_x in current_list)
            {
              var current_object = current_list[address_x];
              //console.log(current_object);
              //console.log("\n");
              if (current_object['address'] == emailAddress)
              {
                //console.log("found email address in database");
                //console.log("\n");
                already_exists = 1;
              }
            }
            if (already_exists == 0)
            {
              // new account
              const myAddress = await web3.eth.getAccounts();
              this1.setState({ message: "Waiting on transaction success.." });
              await bctest.methods.transfer(myAddress[0], 1000000).send({ gas: "700000", from: myAddress[0] });
              this1.setState({ message: "Success - Check your balance" });
              
              // add to database
              fetch('https://my-project-1514223225812.appspot.com/account', {
                method: 'post',
                body: JSON.stringify({address: emailAddress})
              }).then(res => console.log(res));
            }
            if (already_exists == 1)
            {
              this1.setState({ message: "I'm sorry, that address has already received BurgerCoin" });
            }
          }
        }
      };
      checkcurrent.send(null);
    }
    else {
      this.setState({ message: "I'm sorry, we are only giving tokens to *@oregonstate.edu addresses right now..." });
    }
  };

onTransfer = async event => {
  event.preventDefault();
  var this1 = this;
  this.setState({ message: "Heard Click of the transfer button" });
  console.log(this.state.transferee);
  console.log(this.state.transferAmount);
  // Transfer code
  const myAddress = await web3.eth.getAccounts();
  console.log(myAddress);
  this1.setState({ message: "Waiting on transfer to process.." });
  await bctest.methods.transfer(this.state.transferee, this.state.transferAmount).send({ gas: "700000", from: myAddress[0] });
  this1.setState({ message: "Successful transfer - Check your balance" });
};

  render() {
    return (
      <div>
        <h1>Welcome to the BurgerCoin Test Page</h1>
        <h2>The basic of the BurgeCoin</h2>
        <ul>
          <li>BurgerCoinTest contract is deployed at: {this.state.address}</li>
          <li>Decimcals: 18</li>
          <li>Symbol: BUR</li>
        </ul>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h2>Would you like some BurgerCoinTest tokens?</h2>
          <div>
            <p>Amount of coins available in the bank: {this.state.balance} </p>
          </div>
          <label>
            Email Address:
            <input type="text" value={this.state.emailAddy} onChange={this.updateState} />
          </label>
          <br />
          <button>Get Tokens!</button>
          <hr />
        </form>
      
      <form onSubmit={this.onTransfer}>
          <h2>Would you like to transfer some BurgerCoinTest tokens?</h2>
          <div>
            <p>Amount of coins available: {this.state.balance} </p>
          </div>
          <label>
            Address of Recipient:
            <input type="text" value={this.state.transferee} onChange={this.updateTransferee} />
          </label>
          <br />
          <label>
            Amount to Send:
            <input type="number" min="0" step="1" value={this.state.transferAmount} onChange={this.updateAmount}/>
          </label>
          <br />
      
          <button>Send Tokens!</button>
          <hr />
        </form>
      
      <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
