# jsOAuth plugin for Google Chrome Extension - JavaScript OAuth library

jsOAuth is a JavaScript implimentation of the OAuth protocol. Currently supports version 1.0 (RFC5849) of the specification.
(http://bytespider.github.com/jsOAuth/).

The jsOAuth plugin for Google Chrome Extension is an extension that enables Google Chrome Extension support.
(http://github.com/amobiz/jsOAuthChromeEx/).

The implementation of this plugin is based on the article [Tutorial: OAuth](https://developer.chrome.com/extensions/tut_oauth).

Released under the MIT. Please see LICENSE in the project root folder for more information.

## Usage

Download the jsOAuth library form the [bytespider distribution directory](https://github.com/bytespider/jsOAuth/tree/master/dist) and this plugin from the [source directory](https://github.com/amobiz/jsOAuthChromeEx/master/app/scripts) and include it in your background.html.

    <script type="text/javascript" src="library/jsOAuth-1.3.7.js"></script>
    <script type="text/javascript" src="library/jsOAuthChromeEx.js"></script>

In your background.js, make a call to OAuth.initBackgroundPage():

    OAuth.initBackgroundPage();

In manifest.json, you must include the following declaration in "web_accessible_resources" section:

    "web_accessible_resources": [
        "oauth.html"
    ],

The file "oauth.html" is not required but must be declared, it's just used as a placeholder for OAuth callback url.

This gives you a global OAuth object for you to set up and make requests with.
Setting it up is simple.

    <script type="text/javascript">
        var oauth, options;

        options = {
            consumerKey: 'your consumer key from service provider',
            consumerSecret: 'your consumer secret from service provider',
            requestTokenUrl: 'url to acquire the request-token',
            authorizationUrl: 'url to obtain authorization from user',
            accessTokenUrl: 'url to acquire the access-token'
        };

        oauth = new OAuth( options );

    </script>

You'll need to replace the consumer key and secret with your own. Once that is
done, you can make your authenticated 2-legged request.

    <script type="text/javascript">
        function accessService( oauth_token, oauth_token_secret ) {
            // make calls with the access token.
        }

        function successHandler( oauth ) {
            // save access-token for next session.
            localStorage.oauth_token = oauth.getAccessTokenKey();
            localStorage.oauth_token_secret = oauth.getAccessTokenSecret();

            accessService( localStorage.oauth_token, localStorage.oauth_token_secret );
        }

        function failureHandler( error ) {
            localStorage.removeItem( 'oauth_token' );
            localStorage.removeItem( 'oauth_token_secret' );
        }

        if ( localStorage.oauth_token ) {
            accessService( localStorage.oauth_token, localStorage.oauth_token_secret );
        }
        else {
            oauth.authorize( successHandler, failureHandler );
        }
    </script>

If your are managing package dependencies with bower, your can install jsOAuth and jsOAuth plugin for Google Chrome Extension using bower install command.

    bower install git://github.com/bytespider/jsOAuth.git
    bower install git://github.com/amobiz/jsOAuthChromeEx.git

## Authors

  * [Amobiz](https://github.com/amobiz)
