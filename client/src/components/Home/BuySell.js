import React , {useState} from 'react'
import './BuySell.css'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CottageIcon from '@mui/icons-material/Cottage';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function BuySell(props) {

  console.log("props in buy sell", props);
  // access balance by props.balance

    const [coin, setCoin] = React.useState('');
    const handleChange = (event) => {
    setCoin(event.target.value);
  };

    return (
    <div className = "BuySell-div">
      <div className = "Dropdown">
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
          <MenuItem value={20}>Ether</MenuItem>
          <MenuItem value={30}>Cardano</MenuItem>
        </Select>
      </FormControl>
      </div>   
           <List
        sx={{
        width: '100%',
        height: '50%',
        maxWidth: 360,
        color:'white',
        bgcolor: 'black',
        borderRadius: 3
      }}
    >
      <ListItem>
        <ListItemAvatar>
        <ListItemAvatar>
            <MonetizationOnRoundedIcon fontSize="large"/>
        </ListItemAvatar>
        </ListItemAvatar>
        <ListItemText primary="Total Assets "/>
      </ListItem>
      
      <ListItem>
        <ListItemAvatar>
            <AccountBalanceWalletIcon fontSize="large"/>
        </ListItemAvatar>
        <ListItemText primary="Balance" />
      </ListItem>

      <ListItem>
      <ListItemAvatar>
        <ListItemAvatar>
            <CottageIcon fontSize="large"/>
        </ListItemAvatar>
        </ListItemAvatar>
        <ListItemText primary="Holdings" />
      </ListItem>

    </List>
      <div className = "button-row">
      <button className = "button green-button">
           <span>Buy</span>  
      </button>

      <button className = "button red-button">
           <span>Sell</span>  
      </button>
      </div>

      </div>
    )
}
