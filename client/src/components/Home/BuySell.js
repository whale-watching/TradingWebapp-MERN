import React, { useState } from "react";
import "./BuySell.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import CottageIcon from "@mui/icons-material/Cottage";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BuySell(props) {
  const [coin, setCoin] = React.useState("");
  const handleChange = (event) => {
    setCoin(event.target.value);
  };

  return (
    <div className="BuySell-div">
      <div className="Dropdown">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Coin</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={coin}
            label="Coin"
            onChange={handleChange}
          >
            <MenuItem value={10}>Bitcoin</MenuItem>
            <MenuItem value={20}>Ethereum</MenuItem>
            <MenuItem value={30}>Doge Coin</MenuItem>
            <MenuItem value={40}>Tesla</MenuItem>
          </Select>
        </FormControl>
      </div>
      <List
        sx={{
          width: "100%",
          height: "50%",
          maxWidth: 360,
          color: "white",
          bgcolor: "black",
          borderRadius: 3,
        }}
      >
        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar>
              <MonetizationOnRoundedIcon fontSize="large" />
            </ListItemAvatar>
          </ListItemAvatar>
          <ListItemText primary={`Total Assets ${props.totalAssetAmt}`} />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <AccountBalanceWalletIcon fontSize="large" />
          </ListItemAvatar>
          <ListItemText primary={`Balance  ${props.balance}`} />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar>
              <CottageIcon fontSize="large" />
            </ListItemAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={`Holdings  ${JSON.stringify(props.holding)}`}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar>
              <CottageIcon fontSize="large" />
            </ListItemAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={`Sorted Holdings  ${JSON.stringify(props.sortedHolding)}`}
          />
        </ListItem>
      </List>

      <div className="button-row">

        <button
          onClick={() => {
            props.placeOrder(null);
          }}
          className="button green-button"
        >
          <span>Buy</span>
        </button>

        <button
          onClick={() => {
            // props.placeOrder();
            console.log("called sell");
          }}
          className="button red-button"
        >
          <span>Sell</span>
        </button>

      </div>
    </div>
  );
}
