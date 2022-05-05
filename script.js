const URL_BASE = "http://localhost:3030/api"
const backdrop = `rgba(0,0,123,0.4)`
var transactions = []

function openTabContent(evt, option) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(option).style.display = "block";
	evt.currentTarget.className += " active";
}

function openTabHeader(evt, option) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent-title");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks-title");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(option).style.display = "flex";
	evt.currentTarget.className += " active";

	switch (option) {
		case 'transactions':
			return loadTransactions();
	
		default:
			break;
	}
}

function openSubSelected(evt, index) {
	var i, subitem;
	subitem = document.getElementsByClassName("subscription-item");
	for (i = 0; i < subitem.length; i++) {
		subitem[i].className = subitem[i].className.replace(" selected", "");
	}
	evt.currentTarget.className += " selected";

}

function openTransacSelected(evt, index) {
	var i,  subitem;
	$('#detailTransaction').prop('disabled', false)
	$('#deleteTransaction').prop('disabled', false)
	var element = transactions[index];
	subitem = document.getElementsByClassName("transaction-item");
	for (i = 0; i < subitem.length; i++) {
		subitem[i].className = subitem[i].className.replace(" selected", "");
	}
	evt.currentTarget.className += " selected";
	
	$("#transactionSelected").val(JSON.stringify(element));

	$("#nameTransaction").val(element.card_holder_name);
	$("#emailTransaction").val(element.contact_details.email);
	$("#phoneTransaction").val(element.contact_details.phone_number);
	$("#cardTransaction").val(element.masked_credit_card);
	$("#amountTransaction").val(`${element.currency_code} ${element.approved_transaction_amount}`);
	$("#brandTransaction").val(element.payment_brand);
	$("#statusTransaction").val(element.transaction_status);
}

function openPaymentInfo(evt) {
	alert("payment Info")
}

function loadTransactions() {
	$('#transactionsList').html('')
	$("#nameTransaction").val('');
	$("#emailTransaction").val('');
	$("#phoneTransaction").val('');
	$("#cardTransaction").val('');
	$("#amountTransaction").val('');
	$("#brandTransaction").val('');
	$("#statusTransaction").val('');
	$('#detailTransaction').prop('disabled', true)
	$('#deleteTransaction').prop('disabled', true)
	Swal.showLoading()
	var url = `${URL_BASE}/transaction/`
	fetch(url, {
		method: 'GET',
		headers:{
			'Content-Type': 'application/json'
		}
	}).then((res)=>{
		Swal.hideLoading()
		res.json()
			.then((jsonRes)=>{
				Swal.hideLoading()
				var html =``;
				if(!!jsonRes.body){
					transactions = jsonRes.body;
					jsonRes.body.forEach((element, index) => {
						html += `<div id="transaction${index}" class="transaction-item" onclick="openTransacSelected(event, ${index})">
						<div class="transaction-info">
							<p class="text-item">${element.card_holder_name}</p>
							<p class="text-date">${element.created.replace("T"," ")}</p>
						</div>
						<div class="transaction-info">
							<p class="text-price">USD ${element.approved_transaction_amount}</p>
							<p class="text-date">${element.transaction_status}</p>
						</div>
					</div>`
					});
				}
				$('#transactionsList').html(html)	
				console.log(jsonRes);
			})
	})
	.catch((res)=>{
		console.log(res);
		Swal.hideLoading()
		Swal.fire({
			backdrop,
			color: '#5694DF',
			icon: 'error',
			title: 'Oops...',
			text: 'Ocurrio un error!'
		  })
	})
}

function openTransactDetail() {
	var transactionSel = JSON.parse($('#transactionSelected').val()) 
	Swal.fire({
		title: '<strong>Transaccion <u>Detallada</u></strong>',
		html:`<pre id="json-display" style="text-align: left;">Hola</pre>`,
		showCloseButton: true,
		focusConfirm: false,
		didOpen: ()=>{
			
			var editor =new JsonEditor('#json-display', transactionSel);
			editor.load(transactionSel)
		}
	  })
}

function openTransactDelete() {
	Swal.fire({
		title: '¿Quiere eliminar la transaccion?',
		showDenyButton: true,
		showConfirmButton:false,
		showCancelButton: true,
		denyButtonText: `Eliminar`,
	  }).then((result) => {
		
		if (result.isDenied) {
		  Swal.fire('Transaccion eliminada', '', 'info')
		  .then(()=>{
			loadTransactions()
		  })
		}
	  })
}