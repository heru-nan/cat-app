const http = require("http")
const https = require("https")
const fs = require("fs")
const privateKey = fs.readFileSync("./server.key")
const certificate = fs.readFileSync("./server.cert")

const Bundler = require('parcel-bundler');
const app = require('express')();
const {createProxyMiddleware} = require("http-proxy-middleware");

const file = 'src/index.html'; // Pass an absolute path to the entrypoint here
const options = {}; // See options section of api docs, for the possibilities

// Initialize a new bundler using a file and options
const bundler = new Bundler(file, options);

app.use('/predict', createProxyMiddleware({
 target: 'http://localhost:3000'
}));

app.use('/save', createProxyMiddleware({
 target: 'http://localhost:3000'
}));

app.use('/cats', createProxyMiddleware({
 target: 'http://localhost:3000'
}));

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());

// Listen on port 8080
//app.listen(1234);

http.createServer(app).listen(8080);
https.createServer({key: privateKey, cert: certificate} ,app).listen(1234);
