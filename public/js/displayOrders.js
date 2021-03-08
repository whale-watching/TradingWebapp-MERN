var socket = io('http://localhost:8080');
// socket.on('connect', function(){ console.log('connected to socket'); }); 

function showPastOrdersHtml(pastOrders) {

    var htmlTable = "<table>";

    htmlTable += "<tr>";

    htmlTable += "<th>" + "Order No. " + "</td>";
    htmlTable += "<th>" + "Stock"+"</td>";
    htmlTable += "<th>" + "Time placed" + "</td>";
    htmlTable += "<th>" + "Order Completed" + "</td>";
    htmlTable += "<th>" + "Order Type" + "</td>";
    htmlTable += "<th>" + "Amount" + "</td>";
    htmlTable += "<th>" + "Execute when price At" + "</td>";

    htmlTable += "</tr>";


    var index = 1;
    for(var orderKey in pastOrders) {

        var order = pastOrders[orderKey]; 

        var dateTime = new Date(order["timestamp"] ).toISOString().slice(0, 19).replace('T', ' ');

        htmlTable += "<tr>";

        htmlTable += "<td>" + index++ + "</td>";
        // htmlTable += "<td>" + order["crypto"] + "</td>";
        htmlTable += "<td>" + "Bitcoin" + "</td>"; // for now, simplicity
        htmlTable += "<td>" + dateTime + "</td>";
        htmlTable += "<td>" + order["orderCompleted"] + "</td>";

        if("buyNowAmt" in order) {
            htmlTable +="<td>" + "Buy Now" + "</td>";
            htmlTable += "<td>" + order["buyNowAmt"] + "</td>";
            htmlTable += "<td>" + "-" + "</td>";
        }
        else if("buyAtAmt" in order) {
            htmlTable += "<td>" + "Buy At" + "</td>";
            htmlTable += "<td>" + order["buyAtAmt"] + "</td>";
            htmlTable += "<td>" + order["buyAt"] + "</td>";
            htmlTable += "<td>" + "<button> Cancel </button>" + "</td>";
        }
        
        else if("sortNowAmt" in order) {
            htmlTable +="<td>" + "Sort Now" + "</td>";
            htmlTable += "<td>" + order["sortNowAmt"] + "</td>";
            htmlTable += "<td>" + "-" + "</td>";
        }
        else if("sortAtAmt" in order) {
            htmlTable +="<td>" + "Sort At" + "</td>";
            htmlTable += "<td>" + order["sortAtAmt"] + "</td>";
            htmlTable += "<td>" + order["sortAt"] + "</td>";
            htmlTable += "<td>" + "<button> Cancel </button>" + "</td>";
        }

        htmlTable += "</tr>";

    }

    htmlTable += "</table>"

    $("#pastOrderTable").html(htmlTable);
}

socket.on('pastOrders', function(pastOrders) {
    console.log("got past orders");
    console.table(pastOrders);

    showPastOrdersHtml(pastOrders);

});
