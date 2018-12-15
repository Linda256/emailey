
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');


const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');


//connect database
mongoose.connect(keys.mongoURI, ()=>console.log('MongoDB is connected'));

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30*24*60*60*1000,//last for 30 days
    keys:[keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get('/',(req,res)=>{
// 	res.send('Happy Fall Linda! Have a good day')
// });
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production'){
  //Express will server up production assets
  //like our main.js file, or main.css file!
  app.use(express.static('client/build'))

  //Express will serve up the index.html file
  // if it does't recognize the route
  const path = require('path');
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  });


}

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`))