import React, { useState } from "react";
import "./BuySell.css";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import CottageIcon from "@mui/icons-material/Cottage";
import { InputLabel , MenuItem , FormControl , Select , Modal , Box , Stack , List , ListItem , ListItemText , ListItemAvatar , TextField} from "@mui/material"


//Modal Styles
const style = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "black",
    color: "white",
    border: "2px solid #FFFFFF",
    boxShadow: 24,
    p: 4,
  },
  list: {
    width: "100%",
    height: "50%",
    maxWidth: 360,
    color: "white",
    bgcolor: "black",
    borderRadius: 3,
  },
  dropList: {
    color: "black",
    bgcolor: "white",
    borderRadius: "5px",
    marginTop: "15px",
    marginBottom: "10px",
    maxWidth: "56%"
  },
  textBox:{
    bgcolor: "white",
    borderRadius: "5px",
    maxWidth: "80%",
    marginLeft: "15px"
  },
  stack:{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px"

  }
};

export default function BuySell(props) {
  const [coin, setCoin] = React.useState("");
  const handleChange = (event) => {
    setCoin(event.target.value);
  };
  
  //Buy Sell Modal handlers 
  const [buyopen, setBuyOpen] = useState(false);
  const [sellopen, setSellOpen] = useState(false);
  const handleBuyOpen = () => setBuyOpen(true);
  const handleSellOpen = () => setSellOpen(true);

  //Buys Sell data states
  const [orderType, setOrderType] = useState("");
  const [orderAmount , setOrderAmount] = useState(0);

  const Order = () => {
    console.log(orderAmount)
     let order = {
        sybmol: 'BINANCE:BTCUSDT', 
        type: orderType, 
        amount: orderAmount, 
        priceAt: null, 
        orderCompleted: true, 
     }
     props.placeOrder(order);
  }

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
      <List sx={style.list}>
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

      {/*Buy Sell Sort Buttons Row Starts here*/}

      <div className="button-row">
        {/*Buy Button*/}
        <button
          onClick={() => {
            handleBuyOpen();
            props.placeOrder(null);
          }}
          className="button green-button"
        >
          <span>Buy</span>
        </button>
        <Modal open={buyopen} onClose={() => setBuyOpen(false)}>
          <Box sx={style.modal}>
            <h3>Buy Modal text</h3>
            <Stack sx={style.stack} direction="row" spacing={2}>
            <h3>Order type :</h3>
            <FormControl sx={style.dropList} fullWidth>
              <InputLabel id="demo-simple-select-label">Order Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderType}
                label="Type"
                onChange={(e) => {
                  setOrderType(e.target.value);
                  // console.log(orderType);
                }}
              >
                <MenuItem value={"buyAt"}>Buy At</MenuItem>
                <MenuItem value={"buyNow"}>Buy Now</MenuItem>
              </Select>
            </FormControl>
            </Stack>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Buy Quantity :</h3>
              <TextField 
              sx={style.textBox} 
              value={orderAmount}
              id="outlined-basic" 
              label="Quantity" 
              variant="outlined"
              onChange={(e)=>{
                setOrderAmount(e.target.value);
              }}
              />
            </Stack>
            <button className="button green-button" onClick={Order}>
              <span>Buy</span>
            </button>
          </Box>
        </Modal>

        {/*Sell Button*/}

        <button
          onClick={() => {
            handleSellOpen();
            // props.placeOrder();
            console.log("called sell");
          }}
          className="button red-button"
        >
          <span>Sell</span>
        </button>
        <Modal open={sellopen} onClose={() => setSellOpen(false)}>
          <Box sx={style.modal}>
            <h2>Sell Modal text</h2>
            <Stack sx={style.stack} direction="row" spacing={2}>
            <h3>Order type :</h3>
            <FormControl sx={style.dropList} fullWidth>
              <InputLabel id="demo-simple-select-label">Order Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderType}
                label="Type"
                onChange={(e)=>{
                setOrderType(e.target.value);
              }}
              >
                <MenuItem value={"sellAt"}>Sell At</MenuItem>
                <MenuItem value={"sellNow"}>Sell Now</MenuItem>
              </Select>
            </FormControl>
            </Stack>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Sell Quantity :</h3>
              <TextField sx={style.textBox} 
              id="outlined-basic" 
              label="Quantity" 
              variant="outlined" 
              onChange={(e)=>{
                setOrderAmount(e.target.value);
              }}
              />
            </Stack>
            <button className="button red-button" onClick={Order}>
              <span>Sell</span>
            </button>
          </Box>
        </Modal>

        {/*Sort Button*/}

        <button
          onClick={() => {
            // props.placeOrder();
            console.log("called sell");
          }}
          className="button blue-button"
        >
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
}
