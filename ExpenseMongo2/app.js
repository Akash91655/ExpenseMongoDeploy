
const path = require('path');

const express = require('express');
const cors = require('cors');

const fs = require('fs');

require('dotenv').config();

const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const expenseRoutes = require('./routes/expenseapp');
const purchaseRoutes = require('.//routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumfeature');
const passwardRoutes = require('./routes/forgotpassward');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user',adminRoutes)
app.use('/expense',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use('/premium',premiumFeatureRoutes);

app.use('/password',passwardRoutes);

mongoose.connect(process.env.MONGODB_KEY)
.then(result=>{
    console.log("Connected to port")
    app.listen(process.env.PORT);
})
.catch(err=>{console.log(err)})