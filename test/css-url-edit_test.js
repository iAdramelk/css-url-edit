"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    file   = fs.readFileSync( './test/css/urls.css', 'utf-8' ),
    URLS   = require( '../lib/css-url-edit');

var cssURLEditSuite = vows.describe( 'Tests for css-url-edit.' );

cssURLEditSuite.addBatch({

    'Tests for getURLs() method:': {

        topic: function () {

            var css = URLS( file );

            return css;

        },

        'getURLs() returns 6 objects,': function ( css ) {

            assert.equal ( css.getURLs().length, 6 );

        },

        'getURLs(/^data:/) returns 1 object,': function ( css ) {

            assert.equal ( css.getURLs(/^data:/).length, 1 );

        },

        'getURLs("^data:") returns error.': function ( css ) {

            var isError = false;

            try {

                css.getURLs('^data:');

            } catch ( e ) {

                isError = true;

            }

            assert.isTrue( isError );

        }

    }

});

cssURLEditSuite.addBatch({

    'Tests for changeCSSRoot() method:': {

        topic: function () {

            var css = URLS( file );
            css.changeCSSRoot( process.cwd() + "/test/css/", process.cwd() + '/test/css/images');

            return css;

        },

        'changeCSSRoot() will change "images/image.jpeg" to "image.jpeg",': function ( css ) {

            assert.include( css.rebuildCSS(), "url('image.jpeg')" );

        },

        'changeCSSRoot() will change "image.jpg" to "../image.jpg",': function ( css ) {

            assert.include( css.rebuildCSS(), "url('../image.jpg')" );

        },

        'changeCSSRoot() will change "../images/image.gif" to "../../images/image.gif".': function ( css ) {

            assert.include( css.rebuildCSS(), "url('../../images/image.gif')" );

        }

    }

});


cssURLEditSuite.addBatch({

    'Tests for changeURLContent() method:': {

        topic: function () {

            var css = URLS( file );
            css.changeURLContent( /http:\/\/yandex.ru\/(.*)/, 'http://google.com/$1' );

            return css;

        },

        'changeURLContent(/http:\/\/yandex.ru\/(.*)/, "http://google.com/$1") will change yandex.ru to goolge.com': function ( css ) {

            assert.include( css.rebuildCSS(), "url('http://google.com/images/image.gif')" );

        },

        'changeURLContent("abc", "http://google.com/$1") will throw error': function ( css ) {

            var isError = false;

            try {

                css.changeURLContent("abc", "http://google.com/$1");

            } catch ( e ) {

                isError = true;

            }

            assert.isTrue( isError );

        },

    }

});

exports.cssURLEditSuite = cssURLEditSuite;
