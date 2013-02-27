/*
 * css-url-edit
 * https://github.com/iadramelk/css-url-edit
 *
 * Copyright (c) 2013 Alexey Ivanov
 * Licensed under the MIT license.
 */

/**
 * Module for css url strings manipulation.
 *
 * @module cssURLEdit
 * @param  {string} src Source of CSS file to work with.
 */
module.exports = function( src ) {

    'use strict';

    if ( typeof src !== 'string' ) {

        throw { type: 'cssURLEdit', message: 'Please provide content of css file to parse.' };

    }

    var cssp = require( 'cssp' ),
        path = require( 'path' ),
        ast  = cssp.parse( src ), // base asp object from css
        urls = []; // collection of urls to work with

    /**
     * Generates initial document tree.
     *
     * @private
     */
    var _collectURLs = function _collectURLs ( token ) {

        var elem, isArrayElem;

        if ( Array.isArray( token ) ) {

            for ( var i = 0; i < token.length; i++ ) {

                elem = token[ i ];
                isArrayElem = Array.isArray( elem );

                if ( isArrayElem && ( elem[ 0 ] === 'uri' ) ) {

                    urls.push( elem );

                } else if ( isArrayElem ) {

                    _collectURLs( elem );

                }

            }

        }

    };

    _collectURLs( ast );

    /**
     * Returns clean URL string from CSSP url object.
     *
     * @param  {array}  url Array object from urls array.
     * @return {string} URL string without braces.
     * @private
     */
    var _getURLValue = function ( url ) {

        var body = url[ 1 ];

        switch(body[ 0 ]) {
            case 'string':
                return body[ 1 ].substring( 1, body[ 1 ].length - 1 );
            case 'raw':
                return body[ 1 ];
        }

    };


    /**
     * Replace current url in object with new one.
     *
     * @param {array}  url  Array object from urls array.
     * @param {string} path New value for URL object.
     * @private
     */
    var _setURLValue = function ( url, path ) {

        url[1] = ['string', '\'' + path + '\''];

    };


    /**
     * Returns list of unique URLs in css document.
     *
     * @param  {regexp} mask RegExp to test URLs against.
     * @return {array}  Array of matchet URLs.
     */
    var getURLs = function ( mask ) {

        if ( mask && ( mask instanceof RegExp ) !== true ) {

            throw { type: 'getURLs', message: 'First argument must be RegExp' };

        }

        return urls.map( function ( value ) {

            return _getURLValue( value );

        } ).filter( function ( value, pos, self ) {

            var unique = self.indexOf( value ) === pos;

            if ( mask && unique ) {

                return mask.test( value );

            } else {

                return unique;

            }

        } );

    };


    /**
     * Changes relative path of every relative url() address to the new base.
     *
     * @param  {string} from_path Old CSS folder.
     * @param  {string} to_path   New CSS folder.
     */
    var changeCSSRoot = function ( from_path, to_path ) {

        if ( typeof from_path !== 'string' ) {

            throw { type: 'changeCSSRoot', message: 'First argument must be String' };

        }

        if ( typeof to_path !== 'string' ) {

            throw { type: 'changeCSSRoot', message: 'Second argument must be String' };

        }

        urls.filter( function ( value ) {

            return !/^(http|data|\/)/.test( _getURLValue( value ) );

        } ).forEach( function ( value ) {

            var url_path      = _getURLValue( value ),
                absolute_path = path.join( from_path, url_path ),
                new_path      = path.relative( to_path, absolute_path );

            _setURLValue( value, new_path );

        } );

    };


    /**
     * Replace content of every URL matching RegExp with new content.
     *
     * @param  {regexp|string} or from_value Mask to select urls with.
     * @param  {string} to_value Rule to apply on found items.
     */
    var changeURLContent = function ( from_value, to_value ) {

        var type;

        if ( from_value instanceof RegExp ) {

            type = 'RegExp';

        } else if ( typeof from_value === 'string' ) {

            type = 'String';

        } else {

            throw { type: 'changeURLContent', message: 'First argument must be RegExp of String' };

        }

        if ( to_value === undefined ) {

            to_value = "";

        } else if( typeof to_value !== 'string' ) {

            throw { type: 'changeURLContent', message: 'Second argument must be String' };

        }

        urls.filter( function ( value ) {

            if ( type === "RegExp" ) {

                return from_value.test( _getURLValue( value ) );

            } else {

                return _getURLValue( value ).indexOf( from_value ) !== -1;

            }

        } ).forEach( function ( value ) {

            var new_value = _getURLValue( value ).replace( from_value, to_value );
            _setURLValue( value, new_value );

        } );

    };


    /**
     * Return compiled css.
     *
     * @return {String} Compiled CSS
     */
    var rebuildCSS = function () {

        return cssp.translate( ast );

    };


    return {
        getURLs: getURLs,
        changeCSSRoot: changeCSSRoot,
        changeURLContent: changeURLContent,
        rebuildCSS: rebuildCSS
    };

};
