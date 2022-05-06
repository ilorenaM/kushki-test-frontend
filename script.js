const URL_BASE = "https://kushki-test-back.herokuapp.com/api"
const backdrop = `rgba(0,0,123,0.4)`
const publicMerchantKey = "aecb32d17159471ca94b3c0ca316a755"

var kushki = new Kushki({
	merchantId: publicMerchantKey, 
	inTestEnvironment: true,
	regional:false
  });

var transactions = []
var subscriptions = []


function openTabHeader(evt, option) {
  $('#cardsInfo').hide()
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
    
    case  'subscription':
      $('#cardsInfo').show();
      break;
    
    case  'subscriptionsList':
      return loadSubscriptions();
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
  var url = `${URL_BASE}/subscription/${subscriptions[index].subscriptionId}`
  Swal.showLoading()
  fetch(url, {
		method: 'GET',
		headers:{
			'Content-Type': 'application/json'
		}
	}).then((res)=>{
		res.json()
			.then((jsonRes)=>{
				Swal.hideLoading()
				if(!!jsonRes.body){
					console.log(jsonRes.body);
          $('#authorizePayment').prop('disabled', false)
          $('#subscriptionSelected').val(JSON.stringify(jsonRes.body))
          $('#subscriptionDetailName').val(jsonRes.body.cardHolderName)
          $('#subscriptionDetailEmail').val(jsonRes.body.contactDetails.email)
          $('#subscriptionDetailPhone').val(jsonRes.body.contactDetails.phoneNumber)
          $('#subscriptionDetailCard').val(jsonRes.body.maskedCardNumber)
          $('#subscriptionDetailPlan').val(jsonRes.body.planName)
          $('#subscriptionDetailAmount').val(`${jsonRes.body.amount.currency} ${jsonRes.body.amount.subtotalIva}`)
				} else {
          Swal.fire({
            backdrop,
            color: '#5694DF',
            icon: 'error',
            title: 'Oops...',
            text: jsonRes.error
            })
        }
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

	$("#nameTransaction").val(element.card_holder_name ? element.card_holder_name : "");
	$("#emailTransaction").val(element.contact_details ? element.contact_details.email : "");
	$("#phoneTransaction").val(element.contact_details ? element.contact_details.phone_number : "");
	$("#cardTransaction").val(element.masked_credit_card ? element.masked_credit_card : "");
	$("#amountTransaction").val(`${element.currency_code} ${element.approved_transaction_amount}`);
	$("#brandTransaction").val(element.payment_brand ? element.payment_brand : "");
	$("#statusTransaction").val(element.transaction_status ? element.transaction_status : "");
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
	Swal.hideLoading()
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
				} else {
          Swal.fire({
            backdrop,
            color: '#5694DF',
            icon: 'error',
            title: 'Oops...',
            text: jsonRes.error
            })
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
		html:`<pre id="json-display" style="text-align: left;"></pre>`,
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
      Swal.showLoading();
      var transactionSel = JSON.parse($('#transactionSelected').val()) 
      var url = `${URL_BASE}/transaction/void/${transactionSel.ticket_number}`
      fetch(url, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json'
        }
      }).then((res)=>{
        res.json()
          .then((jsonRes)=>{
            Swal.hideLoading()
            var html =``;
            if(!!jsonRes.body){
              Swal.fire({
                backdrop,
                color: '#5694DF',
                icon: 'info',
                title: 'Transaccion eliminada',
                text: 'ticket: ' + jsonRes.body.ticketNumber
                }).then(()=>{
                loadTransactions()
              })
            } else {
              Swal.fire({
                backdrop,
                color: '#5694DF',
                icon: 'error',
                title: 'Oops...',
                text: jsonRes.error
                })
            }
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
        })
}


function transactionApprove() {
	$('#subscriptionCard').val('5451951574925480')
	$('#subscriptionDate').val('11/22')
	$('#subscriptionCVV').val('123')
}

function transactionDeclinedToken() {
	$('#subscriptionCard').val('4574441215190335')
	$('#subscriptionDate').val('11/22')
	$('#subscriptionCVV').val('123')
}

function transactionDeclined() {
	$('#subscriptionCard').val('4349003000047015')
	$('#subscriptionDate').val('11/22')
	$('#subscriptionCVV').val('123')
}

function makeSubscription(evt) {
	
  Swal.showLoading()
	evt.preventDefault()

	

	var card = $('#subscriptionCard').val()
	var date = $('#subscriptionDate').val().split('/')
	var cvv = $('#subscriptionCVV').val()
	var name = $('#subscriptionName').val()
	var lastName = $('#subscriptionLastName').val()
	var email = $('#subscriptionEmail').val()
	var phone = $('#subscriptionPhone').val()

  var callback = function(response) {
		if(!response.code){
		  console.log(response.token);
			var url = `${URL_BASE}/subscription/makesubscription`
      var today = new Date()
      today = today.toISOString().split('T')

      var payload = {
        "planName": "Premium",
        "periodicity": "custom",
        "contactDetails": {
          "email": email,
          "firstName": name,
          "lastName": lastName,
          "phoneNumber": phone
        },
        "amount": {
          "subtotalIva": 50,
          "subtotalIva0": 0,
          "ice": 0,
          "iva": 0,
          "currency": "USD"
        },
        "startDate": today[0],
        "metadata": {
          "plan": "premium"
        }
      }
			fetch(url, {
				method: 'POST',
				headers:{
					'Content-Type': 'application/json',
          'token': response.token
				},
        body: JSON.stringify(payload)
			}).then((res)=>{
        Swal.hideLoading()
        res.json()
          .then((jsonRes)=>{
            if(!!jsonRes.body){
              Swal.fire({
                backdrop,
                color: '#5694DF',
                icon: 'success',
                title: 'Well done',
                text: 'Se ha creado la subscripcion!'
                })
            }else{
              Swal.fire({
                backdrop,
                color: '#5694DF',
                icon: 'error',
                title: 'Oops...',
                text: jsonRes.error
                })
            }
          })
        })
        .catch((err)=>{
          Swal.hideLoading()
          console.log(err);
          Swal.fire({
            backdrop,
            color: '#5694DF',
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error!'
            })
        })

		} else {
      Swal.hideLoading()
      Swal.fire({
        backdrop,
        color: '#5694DF',
        icon: 'error',
        title: 'Oops...',
        text: response.message
        })
		  console.error('Error: ',response.error, 'Code: ', response.code, 'Message: ',response.message);
		}
	}

	kushki.requestSubscriptionToken({
		card: {
		  name: `${name} ${lastName}`,
		  number: card,
		  cvc: cvv,
		  expiryMonth: date[0],
		  expiryYear: date[1]
	  },
		currency: "USD"
	  }, callback);
}


function loadSubscriptions() {
	$('#subscriptionDetailName').val('')
  $('#subscriptionDetailEmail').val('')
  $('#subscriptionDetailPhone').val('')
  $('#subscriptionDetailCard').val('')
  $('#subscriptionDetailPlan').val('')
  $('#subscriptionDetailAmount').val('')
	$('#authorizePayment').prop('disabled', true)
	Swal.showLoading()

	var url = `${URL_BASE}/subscription/`
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
					subscriptions = jsonRes.body;
					jsonRes.body.forEach((element, index) => {
						html += `
          <div id="subscription${index}" class="subscription-item" onclick="openSubSelected(event, ${index})">
							<p class="text-item">Id - ${element.subscriptionId}</p>
						</div>`
					});
				} else {
          Swal.fire({
            backdrop,
            color: '#5694DF',
            icon: 'error',
            title: 'Oops...',
            text: jsonRes.error
            })
        }
				$('#subscriptionsListItems').html(html)	
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

function authorizePayment() {
  Swal.showLoading()
  var subscription = JSON.parse($('#subscriptionSelected').val())
  var url = `${URL_BASE}/subscription/${subscription.subscriptionId}/authorize`
  var payload = {
    "amount": subscription.amount,
    "name": subscription.contactDetails.firstName,
    "lastName":subscription.contactDetails.lastName,
    "email":subscription.contactDetails.email,
    "fullResponse": true
  }
	fetch(url, {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(payload)
	}).then((res)=>{
		Swal.hideLoading()
		res.json()
			.then((jsonRes)=>{
				Swal.hideLoading()
				if(!!jsonRes.body){
					console.log(jsonRes.body);
          Swal.fire({
            title: '<strong>Autorizacion <u>Detallada</u></strong>',
            html:`<pre id="json-display" style="text-align: left;"></pre>`,
            showCloseButton: false,
            confirmButtonText: 'Capturar',
            focusConfirm: false,
            didOpen: ()=>{
              var editor =new JsonEditor('#json-display', jsonRes.body);
              editor.load(transactionSel)
            }
            }).then((result) => {
              if (result.isConfirmed) {
                var urlCapture = `${URL_BASE}/subscription/${subscription.subscriptionId}/capture`
                var payloadCapture = {
                  "ticketNumber": jsonRes.body.ticketNumber
                }
                Swal.showLoading()
                fetch(urlCapture, {
                  method: 'POST',
                  headers:{
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payloadCapture)
                }).then((resCapture)=>{
                  Swal.hideLoading()
                  resCapture.json()
                  .then((jsonResCapture)=>{
                    if(!!jsonResCapture.body){
                      Swal.fire({
                        backdrop,
                        color: '#5694DF',
                        icon: 'success',
                        title: 'Cobro capturado',
                        text: `Ticket: ${jsonResCapture.body.ticketNumber}`
                        })
                    } else {
                      Swal.fire({
                        backdrop,
                        color: '#5694DF',
                        icon: 'error',
                        title: 'Oops...',
                        text: jsonResCapture.error
                        })
                    }
                  })
                  .catch((err)=>{
                    console.log(err);
                    Swal.hideLoading()
                    Swal.fire({
                      backdrop,
                      color: '#5694DF',
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Ocurrio un error!'
                      })
                  })
                })
              }
            })
				} else {
          Swal.fire({
            backdrop,
            color: '#5694DF',
            icon: 'error',
            title: 'Oops...',
            text: jsonRes.error
            })
        }
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