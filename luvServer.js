const http = require( 'http' );
const path = require( 'path' );
const url = require( 'url' );
const fs = require( 'fs' );
const port = 9090;

const extensions = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "application/javascript",
	".png" : "image/png",
	".gif" : "image/gif",
	".jpg" : "image/jpeg"
};

const app = http.createServer( ( req, res ) => {
	const q = url.parse( req.url, true );
	const ext = path.extname( q.pathname );
	const filename = '.' + q.pathname;
	
	if ( !extensions[ ext ] ) {
		res.writeHead( 404, {
			'Content-Type': 'text/html'
		} );
		res.end( 'The requested file type is not supported' );
	}
	fs.readFile( filename, ( err, data ) => {
		const ext = path.extname( filename );
		const mimeType = extensions[ ext ];

		if ( err ) {
			res.writeHead( 404, {
				'Content-Type': mimeType
			} );
			console.log( err );
			return res.end( "404 Not Found" );
		};
		console.log( q );
		res.writeHead( 200, {
			'Content-Type': mimeType
		});
		res.write( data );
		return res.end();
	} );
} );

app.listen( port, err => {
	if ( err ) {
		return console.log( 'whoops', err );
	}
	console.log( `Luv Ledda app listening on port: ${ port }` );
} );

