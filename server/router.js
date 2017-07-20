const render = require('./render').render,
  axios = require('axios');

const client = axios.create({
  // baseURL: 'https://api.github.com/'
});

const request = options => {
  const onSuccess = response => {
    return response.data;
  }

  const onError = error => {
    console.error('Request Failed:', error.config);

    if (error.response) {
      console.error('Status:',  error.response.status);
      console.error('Data:',    error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  }

  return client(options)
    .then(onSuccess)
    .catch(onError);
}

module.exports = function( app ) {

  app.get( '/', function( req, res ) {
    render( req, res, { bundle: 'index' } )
  });

  app.get( '/about', function( req, res ) {
    request( { url: 'https://api.github.com/users/bem' } )
      .then(response => render( req, res, { bundle: 'about', api: response } ) )
      .catch(() => render(req, res, { bundle: 'index', view: '404' }) );
  });

}

