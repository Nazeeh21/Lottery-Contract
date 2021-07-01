import './App.css';
import React, { useEffect, useState } from 'react';
import lottery from './lottery';
import web3 from './web3';

const App: React.FC = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  // const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const init = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setContractBalance(balance);
    };
    init();
  }, []);

  const submitForm = async (e: any) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });
    setMessage('You have been entered!');
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    // setCurrentAccount(accounts[0]);
    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('A winner has been picked!');
  };
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} entered, competing to win{' '}
        {web3.utils.fromWei(contractBalance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={submitForm}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            style={{ marginLeft: '1vw' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button style={{ display: 'block', marginTop: '1vh' }}>Enter</button>
        </div>
      </form>

      <hr />

      <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={onPickWinner}>Pick a winner!</button>
      </div>
      <hr />
      <h1>{message}</h1>
    </div>
  );
};
export default App;
