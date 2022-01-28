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
  AppBar,
  Tabs,
  Tab
} from "@mui/material";

import { numberWithCommas } from "../../utils/miscUtil";
import { StylesContext } from "@material-ui/styles";

//Modal Styles
const style = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#131721",
    color: "white",
    border: "2px solid #FFFFFF",
    boxShadow: 24,
    p: 4,
  },
  list: {
    width: "100%",
    height: "70%",
    maxWidth: 360,
    color: "white",
    bgcolor: "#131722",
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
  bgtext: {
    bgcolor: "#131721",
    color: "white",
  },
  tabsAlign: {
    display: "flex",
    justifyContent: "center",
  },
  upMarign:{
    marginTop: "30px",
  }
};

export default function BuySell(props) {
  // console.log("\n\n\n\n was re rendered", props.totalAssetAmt);

  let totalAssetColor = "white";
  if (props.lastTotalAssetChange === "negative") {
    totalAssetColor = "red";
  } else if (props.lastTotalAssetChange === "positive") {
    totalAssetColor = "#32CD32";
  }

  const [coin, setCoin] = React.useState("bitcoin");
  const handleChange = (event) => {
    setCoin(event.target.value);
    props.onChange(event.target.value);
  };


  //Buys Sell data states
  const [orderType, setOrderType] = useState("");
  const [orderAmount, setOrderAmount] = useState(null);
  const [buyAtAmount, setBuyAtAmount] = useState(null);
  const [sellAtAmount, setSellAtAmount] = useState(null);
  const [sortAtAmount, setSortAtAmount] = useState(null);
  const [sellSortAtAmount, setSellSortAtAmount] = useState(null);


  //Buy Sell Modal handlers
  const [buyopen, setBuyOpen] = useState(false);
  const [sellopen, setSellOpen] = useState(false);
  const [sortopen, setSortOpen] = useState(false);
  const handleBuyOpen = () => setBuyOpen(true);
  const handleSellOpen = () => setSellOpen(true);
  const handleSortOpen = () => setSortOpen(true);

  const handleBuyClose = () => {
    setBuyOpen(false);
    setOrderAmount(null);
    setBuyAtAmount(null);
  }
  const handleSellClose = () => {
    setSellOpen(false);
    setOrderAmount(null);
    setSellAtAmount(null);
  }
  const handleSortClose = () => {
    setSortOpen(false);
    setOrderAmount(null);
    setSortAtAmount(null);
  }

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  }

  const handleBuyOrderClick = () => {
    console.log("clicked on buy");
    handleBuyClose();
    let order = {
      sybmol: convertNameToTradingviewSybmol(coin),
      coinSelectedName: coin,
      type: orderType,
      amount: Number(orderAmount),
      executeWhenPriceAt: Number(buyAtAmount),
      orderCompleted: buyAtAmount ? false: true,
    };
    props.placeOrder(order);
  };

  const handleSortOrderClick = () => {
    console.log("clicked on sort");
    handleSortClose();
    let order = {
      sybmol: convertNameToTradingviewSybmol(props.coinSelectedName),
      coinSelectedName: props.coinSelectedName,
      type: orderType,
      amount: Number(orderAmount),
      executeWhenPriceAt: Number(sortAtAmount),
      orderCompleted: sortAtAmount ? false: true,
    };
    props.placeOrder(order);
  };

  const handleSellModalClick = () => {
    handleSellClose();
    console.log("clicked on sell");
    let order = {
      sybmol: convertNameToTradingviewSybmol(coin),
      coinSelectedName: coin,
      type: orderType,
      amount: Number(orderAmount),
      executeWhenPriceAt: Number(sellAtAmount),
      orderCompleted: sellAtAmount ? false: true,
    };
    props.placeOrder(order);
  };

  const handleSellSortModalClick = () => {
    console.log("clicked on Sell Sort");
    handleSellClose();
    let order = {
      sybmol: convertNameToTradingviewSybmol(coin),
      coinSelectedName: coin,
      type: orderType,
      amount: Number(orderAmount),
      executeWhenPriceAt: Number(sellAtAmount),
      orderCompleted: sellAtAmount ? false : true,
    };
    console.log(order);
    props.placeOrder(order);
  };

  const getFormatedPrice = (totalAssetAmt, digitsAfterDecimal=6) => {
    if (totalAssetAmt === "") {
      return "";
    } else {
      return numberWithCommas(parseFloat(totalAssetAmt.toFixed(digitsAfterDecimal)));
    }
  };

  const getFormatedHolding = (holding) => {
    let formatedHolding = ``;

    if (!holding) return formatedHolding;

    formatedHolding += `\n\n`;

    for (let coinName in holding) {
      formatedHolding += coinName;
      formatedHolding += `: $`;
      formatedHolding += getFormatedPrice(holding[coinName]*props.currentPrice[coinName], 2);
      formatedHolding += `\n`;
    }

    // return formatedHolding;
    return (
      <div style={{ marginTop: "-10px" }}>
        {formatedHolding.split(/\n/).map((line) => (
          <div>{line}</div>
        ))}
      </div>
    );
  };

  const getFormatedSortedHolding = (sortedHolding) => {
    let formatedSortedHolding = ``;

    if(! sortedHolding) return formatedSortedHolding;

    for(let coinName in sortedHolding) {
      if(props.currentPrice[coinName]) {
  
        formatedSortedHolding += coinName;
        formatedSortedHolding += `: $ `;

        let currentCoinAmt = 0;// total amount of coins own
        let currentCoinWorth = 0; // price of the coin own;

        for (let sortedHoldingOrder of sortedHolding[coinName]) {
          // worthThen + (worthThen - currentWorth) = 2*worthThen - currentWorth
          currentCoinAmt += sortedHoldingOrder.amount;
          currentCoinWorth +=
            2 * sortedHoldingOrder.amount -
            sortedHoldingOrder.coinBought * props.currentPrice[coinName];
        }

        // formatedSortedHolding += '';
        formatedSortedHolding += getFormatedPrice(currentCoinWorth, 2);
        formatedSortedHolding += '\n';
      }
    }

    // return formatedSortedHolding;
    return (
      <div style={{ marginTop : "-10px" }}>
        {formatedSortedHolding.split(/\n/).map((line) => (
          <div>{line}</div>
        ))}
      </div>
    );
  }
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
                  {getFormatedPrice(props.totalAssetAmt)}
                </Typography>
              </>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <AccountBalanceWalletIcon fontSize="large" />
          </ListItemAvatar>
          <ListItemText
            primary={`Balance: $ ${numberWithCommas(props.balance)}`}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar>
              <CottageIcon fontSize="large" />
            </ListItemAvatar>
          </ListItemAvatar>

          <ListItemText primary={`Holdings: `} />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar></ListItemAvatar>
          </ListItemAvatar>
          {getFormatedHolding(props.holding)}
          {/* <ListItemText primary={`${getFormatedHolding(props.holding)} `} /> */}
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar>
              <CottageIcon fontSize="large" />
            </ListItemAvatar>
          </ListItemAvatar>
          <ListItemText primary={`Sorted Holdings`} />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <ListItemAvatar></ListItemAvatar>
          </ListItemAvatar>
          {getFormatedSortedHolding(props.sortedHolding)}
          {/* <ListItemText
            primary={`${getFormatedSortedHolding(props.sortedHolding)}`}
          /> */}
        </ListItem>
      </List>

      {/*Buy Sell Sort Buttons Row Starts here*/}

      <div className="button-row">
        {/*Buy Button*/}
        <button
          onClick={() => {
            handleBuyOpen();
            setOrderType("buyNow");
            // props.placeOrder(null);
          }}
          className="button green-button"
        >
          <span>Buy</span>
        </button>
        <Modal open={buyopen} onClose={() => setBuyOpen(false)}>
          <Box sx={style.modal}>
            <h3>Buy Modal</h3>
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
              <h3>Buy Amount :</h3>
              <TextField
                sx={style.textBox}
                value={orderAmount}
                id="outlined-basic"
                type="number"
                label="Quantity (in $)"
                variant="outlined"
                onChange={(e) => {
                  setOrderAmount(e.target.value);
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
            <button
              className="button green-button"
              onClick={handleBuyOrderClick}
            >
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
            <h3>Sort Modal</h3>
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
              <h3>Sort Amount :</h3>
              <TextField
                sx={style.textBox}
                value={orderAmount}
                id="outlined-basic"
                type="number"
                label="Quantity (in $)"
                variant="outlined"
                onChange={(e) => {
                  setOrderAmount(e.target.value);
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
                    setSortAtAmount(e.target.value);
                  }}
                />
              </Stack>
            )}
            <button
              className="button blue-button"
              onClick={handleSortOrderClick}
            >
              <span>Sort</span>
            </button>
          </Box>
        </Modal>

        {/*Sell Button*/}

        <button
          onClick={() => {
            handleSellOpen();
            if (selectedTab === 0) setOrderType("sellNow");
            else setOrderType("sellSortNow");
            // props.placeOrder();
            console.log("called sell");
          }}
          className="button red-button"
        >
          <span>Sell</span>
        </button>
        <Modal open={sellopen} onClose={() => setSellOpen(false)}>
          <Box sx={style.modal}>
            {/* <h3>Sell Modal text</h3> */}
            <AppBar sx={style.bgtext}>
              <Tabs
                sx={style.tabsAlign}
                value={selectedTab}
                onChange={handleTabChange}
              >
                <Tab sx={style.bgtext} label="Sell Normal" />
                <Tab
                  sx={style.bgtext}
                  label="Sell Sort"
                />
              </Tabs>
            </AppBar>

            {selectedTab === 0 ? (
              <Box sx={style.upMarign}>
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
                  <h3>Sell Amount :</h3>
                  <TextField
                    sx={style.textBox}
                    id="outlined-basic"
                    label="Quantity (in $)"
                    variant="outlined"
                    onChange={(e) => {
                      setOrderAmount(e.target.value);
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
                        setSellAtAmount(e.target.value);
                      }}
                    />
                  </Stack>
                )}
                <button
                  className="button red-button"
                  onClick={handleSellModalClick}
                >
                  <span>Sell</span>
                </button>
              </Box>
            ) : (
              <Box sx={style.upMarign}>
                <Stack sx={style.stack} direction="row" spacing={2}>
                  <h3>Order type :</h3>
                  <FormControl sx={style.radioList} fullWidth>
                    <RadioGroup
                      row
                      aria-label="gender"
                      color="black"
                      defaultValue="sellSortNow"
                      name="row-radio-buttons-group"
                      onChange={(e) => {
                        setOrderType(e.target.value);
                        // console.log(orderType);
                      }}
                    >
                      <FormControlLabel
                        sx={style.radioButton}
                        value="sellSortNow"
                        control={<Radio />}
                        label="SELL NOW"
                      />
                      <FormControlLabel
                        sx={style.radioButton}
                        value="sellSortAt"
                        control={<Radio />}
                        label="SELL AT"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack sx={style.stack} direction="row" spacing={2}>
                  <h3>Sell Amount :</h3>
                  <TextField
                    sx={style.textBox}
                    id="outlined-basic"
                    type="number"
                    label="Quantity"
                    variant="outlined"
                    onChange={(e) => {
                      setOrderAmount(e.target.value);
                    }}
                  />
                </Stack>
                {orderType === "sellSortAt" && (
                  <Stack sx={style.stack} direction="row" spacing={2}>
                    <h3>Sell Sort at Price :</h3>
                    <TextField
                      sx={style.textBox}
                      value={sellSortAtAmount}
                      id="outlined-basic"
                      type="number"
                      label="Price"
                      variant="outlined"
                      onChange={(e) => {
                        setSellSortAtAmount(e.target.value);
                      }}
                    />
                  </Stack>
                )}
                <button
                  className="button red-button"
                  onClick={handleSellSortModalClick}
                >
                  <span>Sell Sort</span>
                </button>
              </Box>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
