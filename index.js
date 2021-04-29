const express = require('express');
const cors = require("cors");
const Productrouter = require("./routes/products.route");
const CartRouter = require("./routes/cart.route");
const {dbConnect} = require("./database/database.connect");
const {errorRouteHandler} = require("./middlewares/404Handler.middleware");
const {errorHandler} = require("./middlewares/errorHandler.middleware");


const app = express();
app.use(cors());
app.use(express.json());


dbConnect();

app.use("/products",Productrouter);
app.use("/cart",CartRouter);

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

// Error Handling
app.use(errorRouteHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('server started');
});