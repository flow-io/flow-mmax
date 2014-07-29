flow-mmax
=========

Transform stream factory to find sliding-window maximum values (moving max) over a numeric data stream.

## Installation

```bash
$ npm install flow-mmax
```

## Examples

``` javascript
var eventStream = require('event-stream'),
	maxStream = require('flow-mmax');

// Create an array containing random numbers:
var randoms = new Array( 50 );
for (var i = 0; i < randoms.length; i++) {
    randoms[i] = Math.round(Math.random() * 100);
}

// Create a readable stream from an array:
var randStream = eventStream.readArray(randoms);

// Create a new moving max stream:
var myStream = maxStream()
	.window( 7 )
	.stream();

// Pipe the data:
randStream.pipe(myStream)
    .pipe(eventStream.map(function(d,clbk){
		clbk(null,d.toString()+'\n');
    }))
    .pipe(process.stdout);
```

To run the example code from the top-level application directory,
```bash
$ node ./examples/index.js
```

## Tests

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have globally installed Mocha, execute the following command in the top-level application directory to run the tests:
```bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality. 

## License

[MIT license](http://opensource.org/licenses/MIT).

---
## Copyright

Copyright © 2014. Rebekah Smith.


