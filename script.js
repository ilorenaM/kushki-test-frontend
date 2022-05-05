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
}

function openSubSelected(evt) {
	var i, tabcontent, subitem;

	subitem = document.getElementsByClassName("subscription-item");
	for (i = 0; i < subitem.length; i++) {
		subitem[i].className = subitem[i].className.replace(" selected", "");
	}
	evt.currentTarget.className += " selected";
}

function openTransacSelected(evt) {
	var i,  subitem;

	subitem = document.getElementsByClassName("transaction-item");
	for (i = 0; i < subitem.length; i++) {
		subitem[i].className = subitem[i].className.replace(" selected", "");
	}
	evt.currentTarget.className += " selected";
}

function openPaymentInfo(evt) {
	alert("payment Info")
}