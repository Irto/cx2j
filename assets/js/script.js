/*
 * Convert XML to JSON with HTML5 File API (drag n drop)
 * author: @franklinjavier
 * date: march 2012
 *
 * dependencies and credits
 * ObjTree.js / jkl-dumper.js -> http://jsontoxml.utilities-online.info/
 * minify.json.js -> http://bigaqua.org/minify_json.html
 *
 *
 * TODO Alem da opcao inicial de minificar, criar outra opcao (ou melhorar a existente) 
 * para minificar o resultado do textarea
 *
 */

;(function( window, document, undefined ) { 

    var app = (function() {

        var _extensionAllow = /xml/;

        function init() {
        
            if ( window.File && window.FileReader && window.FileList && window.Blob ) {

                // Setup the dnd listeners
                var dropZone = document.getElementById('dropZone');
                dropZone.addEventListener( 'dragover', handleDragOver, false );
                dropZone.addEventListener( 'dragleave', handleDragLeave, false );
                dropZone.addEventListener( 'drop', readBlob, false );

                // Click on textarea to select all content
                document.getElementById('result').onclick = function() {
                    this.select();
                }

            } else { 

                alert('The File APIs are not fully supported in this browser.');

            }
        
        }

        function readBlob( evt ) {

            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files[ 0 ]; // FileList object

            // Drop a file with an extension not allowed
            if ( !_extensionAllow.test( files.type ) ) {

                evt.srcElement.className = 'drag-not-allow';
                document.getElementById('error').style.visibility = 'visible';

                setTimeout(function() {
                    evt.srcElement.className = '';
                    document.getElementById('error').style.visibility = 'hidden';
                }, 2000);

                return false;

            } 

            var reader = new FileReader(),
                start =  0,
                stop = files.size - 1,
                result = document.getElementById('result');

            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function( evt ) {

                if ( evt.target.readyState == FileReader.DONE ) { // DONE == 2

                    var xotree = new XML.ObjTree(),
                        dumper = new JKL.Dumper(),
                        tree = xotree.parseXML( evt.target.result ),
                        resultJson = dumper.dump( tree );

                    if ( document.getElementById('minify').checked ) {
                        result.innerText = JSON.minify( resultJson );
                    } else {
                        result.innerText = resultJson;
                    }

                    document.getElementById('byteRange')
                        .innerText = 'Read bytes: ' + files.size + ' byte file';
                }

            };

            if ( files.webkitSlice ) { // For webkit
                var blob = files.webkitSlice( start, stop + 1 );
            } else if (files.mozSlice) { // For mozilla
                var blob = files.mozSlice( start, stop + 1 );
            }
            //reader.readAsBinaryString( blob ); // Encoding problem
            reader.readAsText( blob );

            evt.target.className = '';
        }

        function handleDragOver( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy
            evt.srcElement.className = 'drag-enter';
        }

        function handleDragLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.srcElement.className = '';
        }

        return {
            init: init
        }
    
    })();

    app.init();

})( window, document );
