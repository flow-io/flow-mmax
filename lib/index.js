/**
*
*     STREAM: moving maximum
*
*
*     DESCRIPTION:
*        -  Transform stream which finds the maximum value in a sliding-window (moving-max) in a numeric data stream.
*
*
*     NOTES:
*
*
*     TODO:
*
*
*     HISTORY:
*        - 2014/07/28: Created. [RJSmith]
*
*     DEPENDENCIES:
*        [1] through
*
*     LICENSE:
*        MIT
*
*     COPYRIGHT (C) 2014. Rebekah Smith
*
*
*     AUTHOR:
*        Rebekah Smith. rebekahjs17@gmail.com. 2014.
*
*/

(function() {
    'use strict';

    // MODULES //

    var through = require( 'through' );

    // FUNCTIONS //

    /**
     * FUNCTION: getBuffer(W)
     * Returns a buffer array, each element pre-initialised to 0
     * 
     * @private
     * @param {Number} W - buffer size
     * @returns {Array} buffer
     */
    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) {
	    buffer[i] = 0;
	}
	return buffer;
    } //end FUNCTION getBuffer()


    /**
     * FUNCTION: onData(W)
     * Returns a callback which calculates a moving maximum.
     * Invoked upon receiving new data.
     *
     * @private
     * @param {Number} W - window size
     * @returns {Function} callback
     */
    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, 
	dropVal,      // value leaving the buffer window
	N = 0,        // buffer element
	max = Number.NEGATIVE_INFINITY;   // max value in buffer window 
                      // initialise max to be < any potential array value

	/**
	 * FUNCTION: onData(newVal)
	 * Data event handler. Calculates the moving maximum.
	 *
	 * @private
	 * @param {Number} newVal - new streamed data value
	 */
	return function onData(newVal) {
	    // Fill buffer of size W, find initial max
	    if (!full) {
		buffer[N] = newVal; 
		if (buffer[N] > max) {max = buffer[N];}
		N++;           

		if (N===W) {   
		    full = true;
		    this.queue(max);
		}
		return;
	    } // buffer array width W filled, first max found

	    // Update buffer: (drop old value, add new)
	    dropVal = buffer.shift(); 
	    buffer.push(newVal); 

            // Find moving max
	    if (dropVal === max && newVal < max){
		max = buffer[0];
		for(var j=1; j<W; j++){
		    if (buffer[j] > max) {max = buffer[j];}
		}
	    }
	    if (newVal > max){max = newVal;} // (dropVal<max or dropVal===max)
	    //if(dropVal<max && newVal<max) // no change
	    //if(newVal===max) // no change (dropVal<max or dropVal===max)

	    // Queue current max
	    this.queue(max);

	}; // end FUNCTION onData(newVal)
    } // end FUNCTION onData(W)


    // STREAM //

    /**
     * FUNCTION: Stream()
     * Stream constructor
     *
     * @constructor
     * @returns {Stream} Stream instance
     */
    function Stream() {
	this._window = 5; //default window size
	return this;
    } //end FUNCTION Stream()


    /**
     * METHOD: window(value)
     * Window size setter/getter. If a value is provided, sets the window size. If no value is provided, returns the window size.
     *
     * @param {Number} value - window size
     * @returns {Stream|number} stream instance or window size
     */
    Stream.prototype.window = function(value) {
	if (!arguments.length) {
	    return this._window;
	}
	if(typeof value !== 'number' || value !== value) {
	    throw new Error('window()::invalid input argument. Window must be numeric.');
	}
	this._window = value;
	return this;
    }; // end METHOD window()


    /**
     * METHOD: stream()
     * Returns a through stream which finds the sliding-window maximum.
     *
     * @returns {object} through stream
     */
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()

    // EXPORTS //

    module.exports = function createStream() {
	return new Stream();
    };

})();