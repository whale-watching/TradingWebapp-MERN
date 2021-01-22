// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow'
// };

// fetch("https://api.coincap.io/v2/assets/bitcoin/history?interval=d1", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));


function showWidget(selectedSymbol){

	new TradingView.widget(
	  { 
	  "width": 1200,
	  "height": 700,
	  "symbol": selectedSymbol,
	  "timezone": "Asia/Kolkata",
	  "theme": "light",
	  "style": "2",
	  "locale": "in",
	  "toolbar_bg": "#f1f3f6",
	  "enable_publishing": false,
	  "hide_top_toolbar": true,
	  "range": "60M",
	  "save_image": false,
	  "details": true,	  
	  "container_id": "tradingviewDivChart"
	  }
	 );

}

function cryptoSelected(){
	var selectedSymbol = document.getElementById("cryptoSelectForm").value;
	console.log(selectedSymbol);
	showWidget(selectedSymbol);
}

