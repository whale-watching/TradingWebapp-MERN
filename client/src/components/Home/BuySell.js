import React, { useState, useEffect } from "react";
import "./BuySell.css";
import Typography from "@material-ui/core/Typography";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import CottageIcon from "@mui/icons-material/Cottage";
import { convertNameToTradingviewSybmol } from "../../utils/nameSymbol";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Modal,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

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
    maxWidth: "56%",
  },
  textBox: {
    bgcolor: "white",
    borderRadius: "5px",
    maxWidth: "80%",
    marginLeft: "15px",
  },
  stack: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px",
  },
  coinlist: {
    width: "auto",
  },
  radioList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    margin: "0px",
  },
  radioButton: {
    overFlow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "50%",
    fontSize: "10px",
  },
};

export default function BuySell(props) {
  // console.log("\n\n\n\n was re rendered", props.totalAssetAmt);

  let totalAssetColor = "white";
  if (props.lastTotalAssetChange === "negative") {
    totalAssetColor = "red";
  } else if (props.lastTotalAssetChange === "positive") {
    totalAssetColor = "#32CD32";
  }

  const [coin, setCoin] = React.useState("");
  const handleChange = (event) => {
    setCoin(event.target.value);
    props.onChange(event.target.value);
  };

  //Buy Sell Modal handlers
  const [buyopen, setBuyOpen] = useState(false);
  const [sellopen, setSellOpen] = useState(false);
  const [sortopen, setSortOpen] = useState(false);
  const handleBuyOpen = () => setBuyOpen(true);
  const handleSellOpen = () => setSellOpen(true);
  const handleSortOpen = () => setSortOpen(true);

  //Buys Sell data states
  const [orderType, setOrderType] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);
  const [buyAtAmount, setBuyAtAmount] = useState(0);
  const [sellAtAmount, setSellAtAmount] = useState(0);
  const [sortAtAmount, setSortAtAmount] = useState(0);

  const Order = () => {
    console.log(orderAmount);
    let order = {
      sybmol: convertNameToTradingviewSybmol(coin),
      coinSelectedName: coin,
      type: orderType,
      amount: orderAmount,
      priceAt:
        orderType === "buyAt"
          ? buyAtAmount
          : orderType === "sellAt"
          ? sellAtAmount
          : orderType === "sortAt"
          ? sortAtAmount
          : 0,
      orderCompleted: true,
    };
    props.placeOrder(order);
  };

  return (
    <div className="BuySell-div">
      <div className="Dropdown">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Coin</InputLabel>
          <Select
            sx={style.coinlist}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
            value={coin}
            label="Coin"
            onChange={handleChange}
          >
            <MenuItem value={"bitcoin"}>Bitcoin</MenuItem>
            <MenuItem value={"ethereum"}>Ethereum</MenuItem>
            <MenuItem value={"dogecoin"}>Doge Coin</MenuItem>
            <MenuItem value={"tesla"}>Tesla</MenuItem>
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
          {/* <ListItemText primary={`Total Assets ${props.totalAssetAmt}`} /> */}
          <ListItemText
            disableTypography
            primary={
              <>
                <Typography display="inline">Total Assets: $ </Typography>

                <Typography display="inline" style={{ color: totalAssetColor }}>
                  {props.totalAssetAmt}
                </Typography>
              </>
            }
          />
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
            setOrderType("buyNow");
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
              <FormControl sx={style.radioList} fullWidth>
                <RadioGroup
                  row
                  aria-label="gender"
                  color="black"
                  defaultValue="buyNow"
                  name="row-radio-buttons-group"
                  onChange={(e) => {
                    setOrderType(e.target.value);
                    // console.log(orderType);
                  }}
                >
                  <FormControlLabel
                    sx={style.radioButton}
                    value="buyNow"
                    control={<Radio />}
                    label="BUY NOW"
                  />
                  <FormControlLabel
                    sx={style.radioButton}
                    value="buyAt"
                    control={<Radio />}
                    label="BUY AT"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Buy Quantity :</h3>
              <TextField
                sx={style.textBox}
                value={orderAmount}
                id="outlined-basic"
                type="number"
                label="Quantity"
                variant="outlined"
                onChange={(e) => {
                  setOrderAmount(Number(e.target.value));
                }}
              />
            </Stack>
            {orderType === "buyAt" && (
              <Stack sx={style.stack} direction="row" spacing={2}>
                <h3>Buy AT Price :</h3>
                <TextField
                  sx={style.textBox}
                  value={buyAtAmount}
                  id="outlined-basic"
                  type="number"
                  label="Price"
                  variant="outlined"
                  onChange={(e) => {
                    setBuyAtAmount(Number(e.target.value));
                  }}
                />
              </Stack>
            )}
            <button className="button green-button" onClick={Order}>
              <span>Buy</span>
            </button>
          </Box>
        </Modal>
        {/*Sort Button*/}

        <button
          onClick={() => {
            handleSortOpen();
            setOrderType("sortNow");
            // props.placeOrder();
            console.log("called sell");
          }}
          className="button blue-button"
        >
          <span>Sort</span>
        </button>
        <Modal open={sortopen} onClose={() => setSortOpen(false)}>
          <Box sx={style.modal}>
            <h3>Sort Modal text</h3>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Order type :</h3>
              <FormControl sx={style.radioList} fullWidth>
                <RadioGroup
                  row
                  aria-label="gender"
                  color="black"
                  defaultValue="sortNow"
                  name="row-radio-buttons-group"
                  onChange={(e) => {
                    setOrderType(e.target.value);
                    // console.log(orderType);
                  }}
                >
                  <FormControlLabel
                    sx={style.radioButton}
                    value="sortNow"
                    control={<Radio />}
                    label="Sort NOW"
                  />
                  <FormControlLabel
                    sx={style.radioButton}
                    value="sortAt"
                    control={<Radio />}
                    label="Sort AT"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Sort Quantity :</h3>
              <TextField
                sx={style.textBox}
                value={orderAmount}
                id="outlined-basic"
                type="number"
                label="Quantity"
                variant="outlined"
                onChange={(e) => {
                  setOrderAmount(Number(e.target.value));
                }}
              />
            </Stack>
            {orderType === "sortAt" && (
              <Stack sx={style.stack} direction="row" spacing={2}>
                <h3>Sort AT Price :</h3>
                <TextField
                  sx={style.textBox}
                  value={sortAtAmount}
                  id="outlined-basic"
                  type="number"
                  label="Price"
                  variant="outlined"
                  onChange={(e) => {
                    setSortAtAmount(Number(e.target.value));
                  }}
                />
              </Stack>
            )}
            <button className="button blue-button" onClick={Order}>
              <span>Sort</span>
            </button>
          </Box>
        </Modal>

        {/*Sell Button*/}

        <button
          onClick={() => {
            handleSellOpen();
            setOrderType("sellNow");
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
              {/* <FormControl sx={style.dropList} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Order Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={orderType}
                  label="Type"
                  onChange={(e) => {
                    setOrderType(e.target.value);
                  }}
                >
                  <MenuItem value={"sellAt"}>Sell At</MenuItem>
                  <MenuItem value={"sellNow"}>Sell Now</MenuItem>
                </Select>
              </FormControl> */}
              <FormControl sx={style.radioList} fullWidth>
                <RadioGroup
                  row
                  aria-label="gender"
                  color="black"
                  defaultValue="sellNow"
                  name="row-radio-buttons-group"
                  onChange={(e) => {
                    setOrderType(e.target.value);
                    // console.log(orderType);
                  }}
                >
                  <FormControlLabel
                    sx={style.radioButton}
                    value="sellNow"
                    control={<Radio />}
                    label="SELL NOW"
                  />
                  <FormControlLabel
                    sx={style.radioButton}
                    value="sellAt"
                    control={<Radio />}
                    label="SELL AT"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack sx={style.stack} direction="row" spacing={2}>
              <h3>Sell Quantity :</h3>
              <TextField
                sx={style.textBox}
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                onChange={(e) => {
                  setOrderAmount(Number(e.target.value));
                }}
              />
            </Stack>
            {orderType === "sellAt" && (
              <Stack sx={style.stack} direction="row" spacing={2}>
                <h3>Sell AT Price :</h3>
                <TextField
                  sx={style.textBox}
                  value={sellAtAmount}
                  id="outlined-basic"
                  type="number"
                  label="Price"
                  variant="outlined"
                  onChange={(e) => {
                    setSellAtAmount(Number(e.target.value));
                  }}
                />
              </Stack>
            )}
            <button className="button red-button" onClick={Order}>
              <span>Sell</span>
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
