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
* Simpliest installation and configuration.

## Installation ##

* Download the PayzenJS.js file and place it in your project.
* Import it in your web: 

```HTML
    [...]
    <script type="text/javascript" src="/js/PayzenJS.js"></script>
    [...]
```

* Its DONE!

**Note:** if you want to add it as a module in your **Node.js** project with npm, you can just do add it easily:

    npm install PayzenJS
    
And/or add it to your project dependencies.

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
					source: "demopayzenjs/credential"
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
					source: "demopayzenjs/credential"
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
					source: "demopayzenjs/credential"
				}
			});   
```

## Handle credentials ##

In order to authenticate the request it is necessary to sign the form data: https://payzen.io/en-EN/form-payment/standard-payment/computing-the-signature.html

This signature can be set directly in the credentials config:

```javascript
    {
	[...]
        credentials : {
           signature: "606b369759fac4f0864144c803c73676cbe470ff"
	    }
	[...]
    }
```

Or you can set one online resource which should calculate the signature.
Il will be called in a GET call containing all the parameters and return the signature (be sure to enforce the same-origin policy to avoid cross-domain!)
[]

The response from server should be a JSON (application/json) with this format: 

    {"signature": "606b369759fac4f0864144c803c73676cbe470ff"}

## Advanced Usage ##

For more complex payment operations, please check all the possible parameters / operations here: 

https://payzen.io/en-EN/form-payment/standard-payment/generating-a-payment-form.html
