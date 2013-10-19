curl.config({
  baseUrl: '../',
  paths: {
    x: 'y',
  },
  packages: {
    //app: { location: '.', main: 'app' },
  }
});

curl(['app/main']).then(function() {}, function(e) {
    console.error(e);
});