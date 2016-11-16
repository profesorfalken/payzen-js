/*
MIT License

Copyright (c) 2016 Javier Garcia Alonso

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

"use strict";

/**
 * PayzenJS class and main entry.
 * <p>
 * 
 * Contains all the needed functionality in order to perform payment operations
 * using the advanced and powerful Payzen API.
 * <p>
 * 
 * This utility just simplifies the way of creating the forms, setting several
 * parameters as default and applying a convention on form calling and view.
 * <p>
 * 
 * It can be called using a new operator or just with the convenient static
 * method.<br>
 * <code>new PayzenJS().go(config);</code><br>
 * OR<br>
 * <code>PayzenJS.go(config);<code><p>
 * 
 * @returns
 */
function PayzenJS() {

	/**
	 * Main method that takes configuration and perform the payment operation
	 * using the form method provided by Payzen platform.
	 * 
	 * @param config
	 *            JSON/Javascript object containing all operation data
	 */
	this.go = function(config) {
		if (check(config)) {
			var orderData = mergeObjects(defaultOrderData, config.orderData);
			buildCredentialsAndSendForm(config, orderData)
		}
	};

	// Get current data in the right format
	var currDate = new Date, formattedDate = [
			currDate.getUTCFullYear().toString().lpad("0", 4),
			(currDate.getUTCMonth() + 1).toString().lpad("0", 2),
			currDate.getUTCDate().toString().lpad("0", 2) ].join("")
			+ [ currDate.getUTCHours().toString().lpad("0", 2),
					currDate.getUTCMinutes().toString().lpad("0", 2),
					currDate.getUTCSeconds().toString().lpad("0", 2) ].join("");

	// Default config data
	var defaultOrderData = Object.freeze({
		vads_trans_id : Math.floor((Math.random() * 999999) + 1).toString()
				.lpad("0", 6),
		vads_trans_date : formattedDate,
		vads_currency : "978",
		vads_action_mode : "INTERACTIVE",
		vads_page_action : "PAYMENT",
		vads_version : "V2",
		vads_payment_config : "SINGLE"
	});

	/*
	 * Verifies the data of the sent config
	 */
	var check = function(config) {
		if (!config) {
			integrationError(buildCheckMessage("config"));
			return false;
		}
		var configPropsToCheck = [ "credentials", "orderData" ];

		for ( var prop in configPropsToCheck) {
			if (!configPropsToCheck[prop]) {
				integrationError(buildCheckMessage("config." + prop.name));
				return false;
			}
		}
		return true;
	};

	/*
	 * Builds a standard validation message for a missing field.
	 */
	var buildCheckMessage = function(field) {
		return "No " + field + " provided. Please read documentation";
	};

	/*
	 * Shows an integration error. This kind of error should be fixed during the
	 * integration phase and should not happen in production.
	 */
	var integrationError = function(message) {
		// Good old alert message
		window.alert("PayzenJS error - " + message);
		// Log in debug console
		if (window.console && window.console.log) {
			console.error(message)
		}
	};

	/*
	 * Log an unexpected error.
	 */
	var runtimeError = function(message) {
		// Log in debug console
		if (window.console && window.console.log) {
			console.error(message);
		}
	};

	/*
	 * Retrieve the credentials used by the payment platform
	 */
	var buildCredentialsAndSendForm = function(config, orderData) {
		if (config.credentials.signature) {
			buildOrderForm(config.target, config.canvas, orderData,
					config.credentials).submit();
		}

		if (config.credentials.source) {
			var httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState === 4) {
					if (httpRequest.status === 200) {
						buildOrderForm(config.target, config.canvas, orderData,
								JSON.parse(httpRequest.responseText)).submit();
					}
				}
			};
			httpRequest.open("POST", config.credentials.source);
			httpRequest.setRequestHeader("Content-Type",
					"application/json;charset=UTF-8");
			httpRequest.send(JSON.stringify(orderData));
		}
	};

	/*
	 * Creates the form (into the right canvas if specified) that will be posted
	 * in order to start the operation.
	 */
	var buildOrderForm = function(target, canvas, orderData, credentials) {
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "https://" + (target || "secure.payzen.eu")
				+ "/vads-payment/");
		if (canvas) {
			form.setAttribute("target", buildCanvas(canvas));
		}

		for ( var key in orderData) {
			if (orderData.hasOwnProperty(key)) {
				form.appendChild(buildHiddenField(key, orderData[key]));
			}
		}

		// Add signature
		form.appendChild(buildHiddenField("signature", credentials.signature));

		document.body.appendChild(form);

		return form;
	};

	/*
	 * Calculates the canvas (iframe) where the operation should be shown
	 */
	var buildCanvas = function(canvas) {
		var canvasElement = document.getElementById(canvas.id);
		if (canvasElement) {
			var type = canvasElement.nodeName;
			switch (type) {
			case "DIV":
				// Clear div
				canvasElement.innerHTML = "";
				// Create and add iframe			
				canvasElement.appendChild(buildIframe(canvas));
				return canvas.id;
				break;
			case "IFRAME":
				canvasElement.name(canvas.id);
				return canvas.id;
				break
			default:
			}
		}

		return "";
	}

	/*
	 * Builds an iframe to show the form
	 */
	var buildIframe = function(canvas) {
		var iframe = document.createElement('iframe');
		iframe.frameBorder = 0;
		iframe.width = (canvas.width || "600") + "px";
		iframe.height = (canvas.heigh || "440") + "px";
		iframe.name = canvas.id;
		return iframe;
	}

	/*
	 * Builds and returns a hidden field
	 */
	var buildHiddenField = function(name, value) {
		var hiddenField = document.createElement("input");

		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", name);
		hiddenField.setAttribute("value", value);

		return hiddenField;
	};

	/*
	 * Merge to objects
	 */
	var mergeObjects = function(obj1, obj2) {
		var obj3 = {};
		for ( var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}
		for ( var attrname in obj2) {
			obj3[attrname] = obj2[attrname];
		}
		return obj3;
	};
};

/**
 * Static method to call PayzenJS API
 * 
 * @param config
 *            JSON/Javascript object containing all operation data
 */
PayzenJS.go = function(config) {
	new PayzenJS().go(config);
}

// Just some extra syntactical sugar...
String.prototype.lpad = function(padString, length) {
	var str = this;
	while (str.length < length)
		str = padString + str;
	return str;
}