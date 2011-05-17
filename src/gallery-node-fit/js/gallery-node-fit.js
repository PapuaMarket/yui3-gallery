/**
* <p>The Node Fit Module provides truncation capabilities for complex inline structures. 
*   "Fit" can handle many different truncation use cases.</p>
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*       //  Call the "use" method, passing in "gallery-node-fit".  This will <br>
*       //  load the script for the Node Fit Module and all of <br>
*       //  the required dependencies. <br>
* <br>
*       YUI().use("gallery-node-fit", function(Y) { <br>
* <br>
*           Y.one('#demo').fit({ <br>
*               ellipses: '...', <br>
*               skip: 'em, strong' <br>
*           }); <br>
* <br>      
*       }); <br>
* <br>  
*   &#60;/script&#62; <br>
* </code>
* </p>
*
* @module gallery-node-fit
*/

function _doesItFit(node, conf) {
    var r = node.get('region');
    return (r.width === node.get('scrollWidth')) && (conf.lh*2 > node.get('scrollHeight'));
}

function _computeLineHeight(node) {
    // forcing to fallback to regular style when IE fails to compute the style
    var lh = node.getComputedStyle('lineHeight') || node.getStyle('lineHeight');
    // this is assuming the computed lineHeight will return px or numeric value that represent "em".
    return ( lh.indexOf('px') > 0 ? parseInt(lh, 10) : parseInt(lh, 10) * parseInt(node.getComputedStyle('fontSize'), 10) );
}

function _tryToRemove (container, node, conf) {
    var ell = conf.ellipsis,
        originalText, currentLength, charIncrement, good;

    if (!node) {
        return false; // nothing more to cut
    }

    // keep the current length of the text so far
    originalText = node.get('text');
    currentLength = originalText.length;
    // the number of characters to increment or decrement the text by
    charIncrement = currentLength;

    // now, let's start looping through and slicing the text as necessary
    for (; charIncrement > 1; ) {

        if (_doesItFit(container, conf)) {
            good = currentLength;
        } else if (good) {
            break; // the previous iteration was good enough
        }

        // increment decays by half every time 
        charIncrement = Math.floor(charIncrement / 2);

        // if the truncation is good, add some, else remove some chars
        currentLength += good ? +charIncrement : -charIncrement;

        // try text at current length
        node.set('text', originalText.slice(0, currentLength - ell.length) + ell);

    }
    if (good) {
        node.set('text', originalText.slice(0, good - ell.length) + ell );
        return false;
    } else {
        // if we reach this point, that means we can remove the node and try to truncate the previous one
        node.remove();
        return true;
    }
}

// add this to all Y.Node instances under the current Y
Y.DOM.fit = function (node, conf) {
    var n = Y.one(node), // the element we're trying to truncate
        nodes, i, o;

    // homogenize conf to object
    conf = conf || {};
    // augment our conf object with some default settings
    Y.mix(conf, {
        // end marker
        ellipsis : '...',
        skip: 'em',
        lh: _computeLineHeight(n)
    });
    // if we are unable to compute the line-height, then there is not point to 
    // try to truncate, instead it will ended up removing the whole block, bypassing if config.lh is not a valid number
    if (Y.Lang.isValue(conf.lh) && !_doesItFit(n, conf)) {

        nodes = n.all('>*');
        // if there are not child elements, we use the a single item nodelist
        if (nodes.isEmpty()) {
            nodes.push(n);
        }
        i = nodes.size();
        // trying to reduce the content, skipping em from the process
        while ( i && i > 0 && (o = nodes.pop())) {
            if (!o.test(conf.skip) && !_tryToRemove(n, o, conf)) {
                i = false;
            } else {
                i--;
            }
        }
    }

    return n; // keeping the chain
};
Y.Node.importMethod(Y.DOM, 'fit');
Y.NodeList.importMethod(Y.Node.prototype, 'fit');