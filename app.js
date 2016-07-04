var express = require('express');
var app = express();

app.use(express.static('src'));

app.listen(4000, function() {
    console.log('Big 2 app running on port 4000...');
});
