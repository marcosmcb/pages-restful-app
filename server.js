// server.js

// BASE SETUP
// ======================================

// call the packages we need
var express    = require('express');   // call express
var app        = express();            // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect( 'mongodb://test:testpwd@ds111529.mlab.com:11529/pagesdb' );   // connect to our database

var Page       = require('./app/models/page');

// configure the app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );


var port = process.env.PORT || 8080;    // set our PORT

// ROUTES for our API
//=======================================
var router = express.Router();        // get an instance of the express Router

// middleware to use for all requests
router.use( function(req, res, next){
    // do logging
    console.log('Something is happening...');
    next(); // make sure we go to the enxt route and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json( {message: 'hooray! welcome to our API!', request:'1'+req, response: '2'+ res} );
});

// more routes for our API will happen here

// on routes that end in /pages
// -----------------------------------------------------------------------------
router.route( '/pages' )

    // create a bear (accessed at POST http://localhost:8080/api/pages)
    .post( function(req, res) {

        var page  = new Page();     // create a new instance of the Page model
        page.name = req.body.name;  // set the pages name (comes from the request)

        // save the page and check for errors
        page.save( function(err) {
            if(err)
                res.send(err);
            res.json( { message: 'Page created!' } );
        });
    })

    // get all the pages (accessed at GET http://localhost:8080/api/pages)
    .get( function(req, res) {
        Page.find( function(err, pages) {
            if(err)
                res.send(err);
            res.json(pages);
        });
    });

// on routes that end in /pages/:page_id
// -----------------------------------------------------------------------------

router.route('/pages/:page_id')

    // get the page with that id (accessed at GET http://localhost:8080/api/pages/:page_id)
    .get( function(req, res) {
        Page.findById( req.params.page_id, function( err, page ) {
            if( err )
                res.send(err);
            res.json(page);
        });
    })

    // update the page with this id (accessed at PUT http://localhost:8080/api/:page_id)
    .put( function(req, res) {

        // use our page model to find the page we want to
        Page.findById( req.params.page_id, function(err, page) {

            if(err)
                res.send(err);

            page.name = req.body.name;  // update the page info

            // save the page
            page.save( function( err ) {
                if(err)
                    res.send( err );
                res.json( {message: 'Page updated!'} );
            });
        });

    })

    // delete the page with this id (accessed at DELETE http://localhost:8080/api/pages/:page_id)
    .delete( function(req,res) {
        Page.remove( {
            _id : req.params.page_id
        }, function( err, bear){

            if(err)
                res.send(err);
            res.json({message: 'Successfuly deleted'});
        });
    });


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);




// REGISTER OUR ROUTES ------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START the SERVER
// =======================================
app.listen( port );
console.log( 'Magic happens on port ' + port );
