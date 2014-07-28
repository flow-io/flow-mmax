// MODULES //

var chai = require('chai'),          // Expectation library
    utils = require('./utils'),      // Test utilities
    maxStream = require('./../lib'); // Module to be tested

// VARIABLES //

var expect = chai.expect,
    assert = chai.assert;

// TESTS //

describe('moving-max', function tests() {
    'use strict';

    // Test 1
    it('should export a factory function', function test() {
	expect(maxStream).to.be.a('function');
    });

    // Test 2
    it('should provide a method to set/get the window size', function test() {
	var tStream = maxStream();
	expect(tStream.window).to.be.a('function');
    });

    // Test 3
    it('should provide a method to set the window size', function test() {
	var tStream = maxStream();
	tStream.window(42);
	assert.strictEqual(tStream.window(),42);
    });

    // Test 4
    it('should not allow a non-numeric window size', function test() {
	var tStream = maxStream();

	expect( badValue('5') ).to.throw(Error);
	expect( badValue([]) ).to.throw(Error); 
	expect( badValue({}) ).to.throw(Error); 
	expect( badValue(null) ).to.throw(Error); 
	expect( badValue(undefined) ).to.throw(Error); 
	expect( badValue(NaN) ).to.throw(Error); 
	expect( badValue(false) ).to.throw(Error);
	expect( badValue(function(){}) ).to.throw(Error);

	function badValue(value) {
	    return function() {
		tStream.window(value);
	    };
	} 
    }); //end non-numeric window

    // Test 5
    it('should find the max value of the data in the window', function test(done) {
	var data, expected, tStream, WINDOW = 5;

	// Simulate some data
	// simulation contains all dropVal/newVal vs max combos
	data = [41,18,10,7,25,33,9,33,8,12,33,21,44,51];

	// Expected values of rolling max in window
	expected = [41,33,33,33,33,33,33,33,44,51];

	// Create a new max stream
	tStream = maxStream()
	    .window(WINDOW)
	    .stream();

	// Mock reading from the stream
	utils.readStream(tStream,onRead);

	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	/**
	 * FUNCTION: onRead(error, actual)
	 * Read event handler. Checks for errors. Compares streamed and expected data.
	 */
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);

	    for (var i = 0; i < expected.length; i++ ) {
		assert.strictEqual( actual[i], expected[i] );
	    }

	    done();

	} //end FUNCTION onRead()
    });

    // Test 6
    it('should find the max value of piped data in arbitrary window size', function test(done) {

	var data, expected, tStream, WINDOW = 3;

	// Simulate some data (test all dropVal/newVal combinations)
	data = [21,45,8,45,35,4,45,63,28,15,72];

	// Expected values of max in moving window
	expected = [45,45,45,45,45,63,63,63,72];

	// Create a new max stream
	tStream = maxStream()
	    .window(WINDOW)
	    .stream();

	// Mock reading from the stream
	utils.readStream(tStream,onRead);

	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	/**
	 * FUNCTION: onRead(error, actual)
	 * Read event handler. Check for errors. Compare streamed and expected data.
	 */
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);

	    for (var i = 0 ; i < expected.length; i++ ) {
		assert.strictEqual( actual[i], expected[i]);
	    }

	    done();
	} // end FUNCTION onRead()
    }); 

      }); // end description of tests

