# css-url-edit [![Build Status](https://secure.travis-ci.org/iadramelk/css-url-edit.png)](http://travis-ci.org/iadramelk/css-url-edit)

Collection of helpers for css url manipulations. Strongly inspired and partially based on code from [cssrb](https://github.com/afelix/cssrb) project.

## Getting Started

Install the module with: `npm install css-url-edit`

```javascript
var css_url_edit = require('css-url-edit');
```

## Documentation

First of all you need to create an URLs collection from your css file.

```javascript
var URLS = css_url_edit( string_with_css );
```

After that you will have following methids in your code:

### getURLs

```javascript
URLS.getURLs( [mask] );
```

**mask** *{regex}* is an optional parameter. It will return not all found URLs, but only URLs that match this RegExp.

Returns array of unique URLs in css document.

### changeCSSRoot

```javascript
URLS.changeCSSRoot( from_path, to_path );
```

**from_path** and **to_path** must be *{string}* with absolute path to folders.

Changes relative path of every relative url() address in the URLS object to the new base.

### changeURLContent

```javascript
URLS.changeURLContent( from_value, [to_value] );
```

**from_value** *{regexp}* Mask to select urls with.  
**to_value** *{string}*  Rule to apply on found items.

Replace content of every URL matching RegExp with new content.

### rebuildCSS

```javascript
URLS.rebuildCSS();
```

 Return compiled css.

## Examples


```javascript
var css_url_edit = require('css-url-edit');

var URLS = css_url_edit( string_with_css );

URLS.changeURLContent( /^\/media\//, '/images/' );

var new_css = URLS.rebuildCSS();

```

## Release History

### 0.1.0 What's new
  - Initial release.

## License
Copyright (c) 2013 Alexey Ivanov  
Licensed under the MIT license.
