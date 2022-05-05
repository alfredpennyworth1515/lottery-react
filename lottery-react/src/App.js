import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    jackpot:"",
    ticketPrice:""
  };
  async componentDidMount() {
    const manager = await lottery.methods.owner().call();
    const players = await lottery.methods.getPlayers().call();
    const jackpot = await lottery.methods.lotteryPool().call();
    const ticketPrice = await lottery.methods.ticketPrice().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const contractAddress = '0xb2c2bf6b377001285c8584a304911a8370850316' //await web3.eth.address();

    this.setState({ manager, players, balance, jackpot, ticketPrice, contractAddress });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.buyTicket().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          <br/>
          There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
          <br/>
          Current Jackpot {this.state.jackpot}
          <br/><br/>
          Contract Address @ Rinkeby : {this.state.contractAddress}
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Buy ticket</h4>
          <div>
            <label>Enter total amount</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Buy</button>
        </form>

        <hr />
        <h4>Ticket Price: {this.state.ticketPrice}</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
