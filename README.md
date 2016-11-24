# PayzenJS library 

PayzenJS is a javascript library that allows you to integrate Payzen platform in your site easily.

```javascript
    PayzenJS.go({								
		orderData: {
			vads_site_id: "12345678",
			vads_ctx_mode: "TEST",
			vads_amount: "100"
		},
		credentials : {
			source: "credential.php"
		}
	});   
```

See live demo here: http://www.profesorfalken.com/PayzenJSDemo

## What can I do with it ##

With PayzenJS you can perform:

* Payment operations by form in browser.
* Payment operations by iframe.
* Payment operations using popups, transitions, etc (using external libs if necessary). 

Your creativity and skills are your only limit!

Check [Payzen documentation] (https://payzen.io/en-EN/form-payment/standard-payment/deferred-payment.html) to see what operations you can accomplish.

## Characteristics ##

* Just download and use.
* Tiny JavaScript File.
* No a single dependency. Pure JavaScript Vanilla that work in your browser out of the box.
* The simpliest installation and configuration.

## Installation ##

* Download the PayzenJS.js file and place it in your project.
* Import it in your web: 

```HTML
    [...]
    <script type="text/javascript" src="/js/PayzenJS.js"></script>
    [...]
```

* Its DONE!

**Note:** this is a client-side but if you want to take advantage of **Node.js** npm package system and require it using solutions as [browserify](http://browserify.org), you can perform a:

    npm install PayzenJS
    
And/or add it to your project dependencies in package.json.

After that, you can use it anytime you want and it will be bundled in your solution:

```javascript
   var PayzenJS = require("PayzenJS");
```

## Basic Usage ##

#### Full form payment ####

```javascript
    //Launch full form payment
    PayzenJS.go({								
		orderData: {
			vads_site_id: "12345678",
			vads_ctx_mode: "TEST",
			vads_amount: "100"
		},
		credentials : {
			source: "credential.php"
		}
	});   
```

#### Payment into canvas (iframe) ####

First, you have to set the 'canvas'. 
This can be an existing div element in your page or an already defined iframe.

```HTML
    [your page]
    <div id="paymentCanvas"/>
	[your page]
```

Then you only have to set the right config.

```javascript
    //Launch full form payment
    PayzenJS.go({			
		canvas: {
				    id: "paymentCanvas"
			},				
		orderData: {
			vads_site_id: "12345678",
			vads_ctx_mode: "TEST",
			vads_amount: "100"
		},
		credentials : {
			source: "credential.php"
		}
	});   
```

## Handle credentials ##

In order to authenticate the request it is necessary to sign the form data: 

In order to authenticate using PayzenJS, you have to set one online resource which should calculate the signature.

```javascript
    {
	[...]
        credentials : {
           source: "credential.php"
	    }
	[...]
    }
```

This will call and endpoint called credential.php. This call will be:

* Made by POST
* With a content-type: application/json;charset=UTF-8
* With a JSON as payload containing all the form fields

```javascript
    {vads_trans_id: "024366", vads_trans_date: "20161124193157", va...}
```

On server side you must sign the content using your private key as described in the official documentation:

https://payzen.io/en-EN/form-payment/standard-payment/computing-the-signature.html

And give a response from server that must be also JSON (application/json) encoded in UTF-8 and with this format: 

    {"signature": "606b369759fac4f0864144c803c73676cbe470ff"}

## Examples of credential calculation implementation ##

* [In PHP] (https://github.com/profesorfalken/profesorfalken.github.io/blob/master/examples/PayzenJS/credential/php/credential.php)
* [In Java (Servlet)] (https://github.com/profesorfalken/profesorfalken.github.io/blob/master/examples/PayzenJS/credential/java/servlet/Credential.java)

## Advanced Usage ##

For more complex payment operations (card registration, payment by id, etc), please check all the possible parameters / operations here: 

https://payzen.io/en-EN/form-payment/standard-payment/generating-a-payment-form.html
