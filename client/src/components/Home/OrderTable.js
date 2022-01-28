import * as React from "react";
import PropTypes from "prop-types";
import { withStyles , makeStyles } from "@material-ui/styles";
import Box from "@mui/material/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const styles = (theme) => ({
  root: {
    borderRadius: "15px",
    width: "95%",
    overflowX: "auto",
    backgroundColor: "#131722",
    color: "blue",
  },
  table: {
    minWidth: 500,
  },
  head: {
    fontSize: "20px",
    color: "white",
  },
  tableRow: {
    "&$selected, &$selected:hover": {
      backgroundColor: "red",
    },
    color: "white",
  },
  tableCell: {
    color: "white",
  },
  hover: {},
  selected: {},
});

// This function is for the bottom bar which keeps pages
function TablePaginationActions(props) {

    const theme = {
      color:"white",  
      direction: "rtl",
    };

    function iconStyles() {
      return {
        whiteIcon: {
          color: "white",
        },
      };
    }
  
  const classes = makeStyles(iconStyles)();

  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        className={classes.whiteIcon}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        className={classes.whiteIcon}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        className={classes.whiteIcon}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        className={classes.whiteIcon}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
    </Box>
  );
}


function OrderTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows = [];
  const { classes } = props;
  
  let id = 0;
  // console.log(props.allOrders);

  // This will insert all the orders in an array of objects in reversed order.
  props.allOrders.forEach(function (arrayItem) {
      id += 1;
      // console.log(arrayItem);
      rows[props.allOrders.length - id] = {
        id: id,
        time: arrayItem.time,
        name: arrayItem.coinSelectedName,
        coin: arrayItem.sybmol,
        amount: arrayItem.amount,
        coinBought: arrayItem.coinBought,
        type: arrayItem.type,
        status: arrayItem.orderCompleted ? "true" : "false",
        priceat: arrayItem.executeWhenPriceAt,
      };
  });

  //To Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const calculateGains = (order) => {
    if(order.status === "false" || order.type === 'sellNow' || order.type === 'sellAt') {
      return null;
    }

    if(order.type === 'buyNow') {
      // console.log(order.coinBought, props.getCurrentPrice()[order.name], order.amount)
      let currentWorth = parseFloat(order.coinBought) * parseFloat(props.getCurrentPrice()[order.name]);
      let gain = currentWorth - parseFloat(order.amount);
      gain = gain.toFixed(2);

      return '$ '+gain;
    }
    else if(order.type === 'sortNow') {
      let currentWorth = parseFloat(order.coinBought) * parseFloat(props.getCurrentPrice()[order.name]);
      let gain = parseFloat(order.amount) - currentWorth;
      gain = gain.toFixed(2);

      return '$ '+gain;
    }
  }

  const calculateGainPercent = (order) => {

    if(order.status === "false" || order.type === 'sellNow' || order.type === 'sellAt') {
      return null;
    }

    if(order.type === 'buyNow') {
      // console.log(order.coinBought, props.getCurrentPrice()[order.name], order.amount)
      let currentWorth = parseFloat(order.coinBought) * parseFloat(props.getCurrentPrice()[order.name]);
      let gain = currentWorth - parseFloat(order.amount);

      let gainPercent = gain/parseFloat(order.amount) * 100;
      gainPercent = gainPercent.toFixed(2);
      return gainPercent+'%';
    }
    else if(order.type === 'sortNow') {
      let currentWorth = parseFloat(order.coinBought) * parseFloat(props.getCurrentPrice()[order.name]);
      let gain = parseFloat(order.amount) - currentWorth;

      let gainPercent = gain/parseFloat(order.amount) * 100;
      gainPercent = gainPercent.toFixed(2);
      return gainPercent+'%';
    }
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.head}></TableCell>
            <TableCell className={classes.head}>Time</TableCell>
            <TableCell className={classes.head}>Coin</TableCell>
            <TableCell className={classes.head}>CoinCode</TableCell>
            <TableCell className={classes.head}>Amount</TableCell>
            <TableCell className={classes.head}>Gains</TableCell>
            <TableCell className={classes.head}>Gains Percent</TableCell>
            <TableCell className={classes.head}>Type</TableCell>
            <TableCell className={classes.head}>Order Completed</TableCell>
            <TableCell className={classes.head}>Price At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id} className={classes.tableRow}>
              <TableCell
                className={classes.tableCell}
                component="th"
                scope="row"
              >
              </TableCell>
              <TableCell className={classes.tableCell}>{new Date(row.time).toLocaleString()}</TableCell>
              <TableCell className={classes.tableCell}>{row.name}</TableCell>
              <TableCell className={classes.tableCell}>{row.coin}</TableCell>
              <TableCell className={classes.tableCell}>{'$'+row.amount}</TableCell>
              <TableCell className={classes.tableCell}>{calculateGains(row)}</TableCell>
              <TableCell className={classes.tableCell}>{calculateGainPercent(row)}</TableCell>
              <TableCell className={classes.tableCell}>{row.type}</TableCell>
              <TableCell className={classes.tableCell}>{row.status}</TableCell>
              <TableCell className={classes.tableCell}>{row.priceat? row.priceat : null}</TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 50 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={0}
              sx={{ color: "white" }}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              //   SelectProps={{
              //     inputProps: {
              //       "aria-label": "rows per page",
              //     },
              //     native: true,
              //   }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderTable);
