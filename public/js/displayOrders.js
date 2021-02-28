var socket = io('http://localhost:8080');
// socket.on('connect', function(){ console.log('connected to socket'); }); 

function showPastOrdersHtml() {
    
}

socket.on('pastOrders', function(pastOrders) {
    // console.log("got past orders ");
    console.log(pastOrders);


});
