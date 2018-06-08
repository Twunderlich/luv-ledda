'use strict'

const http = require( 'http' );
const path = require( 'path' );
const url = require( 'url' );
const fs = require( 'fs' );
const port = process.argv[ 2 ] || 9090;

const app = http.createServer( ( req, res ) => {
	console.log( `${ new Date() } Received a ${ req.method } request for ${ req.url }` );

  	const parsedUrl = url.parse( req.url, true );
	let pathname = `.${ parsedUrl.pathname }`;
	const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };

  // fs.exists is deprecated
  fs.exists( pathname, function ( exist ) {
  	if ( !exist ) {
  		res.statusCode = 404;
  		res.end( `File ${ pathname } not found`)
  	}

  	if ( fs.statSync( pathname ).isDirectory() ) {
  		pathname += '/index.html';
  	}

  	fs.readFile( pathname, function( err, data ) {
  		if ( err ) {
  			res.statusCode = 500;
  			res.end( `Error getting the file: ${ err }.`)
  		} else {
  			const ext = path.parse( pathname ).ext;
  			res.setHeader( 'Content-Type', mimeType[ ext ] || 'text/plain' );
  			res.end( data );
  		}
  	} );
  } );
} );

app.listen( port, err => {
	if ( err ) {
		return console.log( 'whoops', err );
	}
	console.log( `${ new Date() } Luv Ledda Server listening on port: ${ port }` );
} ); 

