import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import data from './data';

function App() {
  const [dataList, setDataList] = useState({});
  const [userRewards, setCalcRewards] = useState({});
  const [userTransactions, setUserTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });

  useEffect(() => {
    console.log('Help');
    setDataList({ ...data });
    setUsers([...Object.keys(data)]);

  }, []);

  const userSelect = (value) => {
    setCurrentUser(value);
    let userData = dataList[value];

    let monthN = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };
    for (let i = 0; i < userData.length; i++) {
      let month = new Date(userData[i]['date']);
      if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
        monthN[month.getMonth() + 1]['amounts'].push(userData[i]['amount']);
      }
    }
    for (let key in monthN) {
      let total_month_rewards = 0;
      for (let i = 0; i < monthN[key]['amounts'].length; i++) {
        let price = monthN[key]['amounts'][i];

        total_month_rewards = total_month_rewards + calcReward(price);
      }
      monthN[key]['rewards'] = total_month_rewards;
    }
    console.log(monthN)
    setCalcRewards({ ...monthN });
    setUserTransactions([...userData]);
  };

  const updateInput = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
    }
  }

  const btnAddtransaction = () => {
    let data = { ...dataList };
    let month = new Date(newTransaction['date']);
    if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
      data[currentUser].push(newTransaction);
      console.log(data)
      setDataList({ ...data });

      userSelect(currentUser);
    }
    setNewTransaction({ date: new Date(), amount: 0 });
  }
  return (
    <div style={{
      marginTop: "20px",
      marginBottom: "50px",
      fontSize: "20px",
    }}>
      <h2 style={{ textAlign: "center" }}>User Rewards Dashborad</h2>
      <div className="select-style">
        <select onChange={e => userSelect(e.target.value)} value={currentUser} >
          <option value="" disabled>Select User</option>
          {users.map((item, index) => {
            return (
              <option key={index} value={item}> {item.toUpperCase()} </option>
            );
          })}
        </select>
      </div>
      {Object.keys(userRewards).length > 0 &&
        <Fragment>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First Month</td>
                <td>{userRewards[1]["rewards"]}</td>
              </tr>
              <tr>
                <td>Second Month</td>
                <td>{userRewards[2]["rewards"]}</td>
              </tr>
              <tr>
                <td>Third Month</td>
                <td>{userRewards[3]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>{userRewards[1]["rewards"] + userRewards[2]["rewards"] + userRewards[3]["rewards"]}</td>
              </tr>
            </tbody>
          </table>
          <h4>User Transactions</h4>
          {userTransactions.length > 0 ?
            <table className="customers">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>

              </thead>
              <tbody>
                {userTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    <td>{calcReward(item["amount"])}</td>
                  </tr>
                })}
              </tbody>
            </table>
            : <div>No Transactions Found</div>}
          <div>
            <h4>Add Transactions</h4>
            <h5>Only Transactions between 05/01/2022 and 07/31/2022 will be added</h5>
            <label>Date : </label><input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
            <label>Amount :</label><input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
            <button onClick={() => btnAddtransaction()}>Add Transaction</button>
          </div>
        </Fragment>
      }


    </ div >
  );
}

export default App;

function calcReward(price) {
  let rewards = 0;
  if (price >= 50 && price <= 100) {
    rewards = price - 50;
  }
   if (price > 100) {
    rewards = (2*(price-100) + 50);
  }
  return rewards;

}