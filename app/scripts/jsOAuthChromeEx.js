(function( OAuth ) {
    'use strict';

    var _initOriginal;

    OAuth.initBackgroundPage = function() {
        if ( OAuth.prototype.init !== initInterceptor ) {
            _initOriginal = OAuth.prototype.init;
            OAuth.prototype.init = initInterceptor;
        }
    };

    function initInterceptor( options ) {
        var self, urlOAuth;

        self = this;    // jshint ignore:line

        // note: this file is actually not exist and not ever loaded, but must be declared in "web_accessible_resources".
        options.callbackUrl = urlOAuth = chrome.extension.getURL( 'oauth.html' );
        //options.callbackUrl = 'oob';
        chrome.tabs.onUpdated.addListener(function( tabId, changeInfo/*, tab*/ ) {
            var params;
            if ( changeInfo.url && changeInfo.url.indexOf( urlOAuth ) === 0 ) {
                params = changeInfo.url.substring( changeInfo.url.indexOf( '?' ) + 1 );
                chrome.tabs.remove( tabId );
                gotAuthorized( self, { 'text': params } );
            }
        });

        self.chromeExt = {
            parameters: {},
            requesting: false,
            onsuccess: null,
            onfailure: null
        };
        _initOriginal.call( self, options );
    }

    function gotAuthorized( self, params ) {
        params = self.parseTokenRequest( params );
        if ( params.oauth_verifier ) {
            self.setVerifier( params.oauth_verifier );
            self.fetchAccessToken(function( params ) {
                params = self.parseTokenRequest( params );
                self.setParameter( params );
                handleSuccess( self );
            }, function( error ) {
                handleFailure( self, error );
            });
        }
    }

    function handleSuccess( self ) {
        self.chromeExt.requesting = false;
        if ( self.chromeExt.onsuccess ) {
            self.chromeExt.onsuccess( self );
        }
    }

    function handleFailure( self, error ) {
        self.chromeExt.requesting = false;
        if ( self.chromeExt.onfailure ) {
            self.chromeExt.onfailure( error );
        }
    }

    OAuth.signin = {};

    OAuth.signin.twitter = function(consumerKey, consumerSecret, callback) {
        new OAuth({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
            authorizationUrl: 'https://api.twitter.com/oauth/authorize',
            accessTokenUrl: 'https://api.twitter.com/oauth/access_token'
        }).authorize(callback, function(error) {

        });
    };

    OAuth.twitter = function(consumerKey, consumerSecret, callback) {
        return new OAuth({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
            authorizationUrl: 'https://api.twitter.com/oauth/authenticate',
            accessTokenUrl: 'https://api.twitter.com/oauth/access_token'
        });
    }

    OAuth.prototype.authorize = function( onsuccess, onfailure ) {
        var self = this;

        if ( this.getAccessTokenKey() ) {
            onsuccess( this );
        }
        else if ( self.chromeExt.requesting ) {
            throw new Error('authorize process is already initialized...');
        }
        else {
            self.chromeExt.requesting = true;
            self.chromeExt.onsuccess = onsuccess;
            self.chromeExt.onfailure = onfailure;
            this.fetchRequestToken(function( url ) {
                console.log('tokenUrl='+url);
                window.open( url, '_blank' );
            }, function( error ) {
                handleFailure( self, error );
            });
        }
    };

    OAuth.prototype.getParameter = function( name ) {
        return this.chromeExt.parameters[ name ];
    };

    OAuth.prototype.setParameter = function( name, value ) {
        var values, params, k;

        if ( 'string' === typeof name ) {
            this.chromeExt.parameters[ name ] = value;
        }
        else {
            values = name;
            params = this.chromeExt.parameters;
            for ( k in values ) {
                if ( values.hasOwnProperty( k ) ) {
                    params[ k ] = values[ k ];
                }
            }
        }
    };

})( OAuth );
