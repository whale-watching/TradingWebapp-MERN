var socket = io('http://localhost:8080');
// socket.on('connect', function(){ console.log('connected to socket'); }); 

function showPastOrdersHtml(pastOrders) {

    var htmlTable = "<table>";

    htmlTable += "<tr>";

    htmlTable += "<th>" + "Order No. " + "</td>";
    htmlTable += "<th>" + "Stock"+"</td>";
    htmlTable += "<th>" + "Time placed" + "</td>";
    htmlTable += "<th>" + "Order Completed" + "</td>";
    htmlTable += "<th>" + "Buy Amount" + "</td>";
    htmlTable += "<th>" + "Buy At" + "</td>";
    // htmlTable += "<button> sell All</button>";

    htmlTable += "</tr>";


    var index = 1;
    for(var orderKey in pastOrders) {

        var order = pastOrders[orderKey]; 

        var dateTime = new Date(order["timestamp"] ).toISOString().slice(0, 19).replace('T', ' ');

        htmlTable += "<tr>";

        htmlTable += "<td>" + index++ + "</td>";
        // htmlTable += "<td>" + order["crypto"] + "</td>";
        htmlTable += "<td>" + "Bitcoin" + "</td>";
        htmlTable += "<td>" + dateTime + "</td>";
        htmlTable += "<td>" + order["orderCompleted"] + "</td>";

        if("buyNowAmt" in order) {
            htmlTable += "<td>" + order["buyNowAmt"] + "</td>";
            htmlTable += "<td>" + "-" + "</td>";
        }
        else {
            htmlTable += "<td>" + order["buyAtAmt"] + "</td>";
            htmlTable += "<td>" + order["buyAt"] + "</td>";
        }

        htmlTable += "</tr>";

    }

    htmlTable += "</table>"

    $("#pastBuyOrderTable").html(htmlTable);
}

socket.on('pastOrders', function(pastOrders) {
    console.log("got past orders");
    console.table(pastOrders);

    showPastOrdersHtml(pastOrders);

});
