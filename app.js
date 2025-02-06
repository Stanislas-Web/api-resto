const express = require('express');
const app = express();
const cors = require('cors');
const RestoRouter = require('./routers/resto.router');
const CategoryRouter = require('./routers/category.router');
const PlatsRouter = require('./routers/plats.router');
const OrderRouter = require('./routers/order.router');
const InvoiceRouter = require('./routers/invoice.router');
const FactureRouter = require('./routers/facture.router');
const ZoneRouter = require('./routers/zone.router');
const TableRouter = require('./routers/table.router');
const DeliveryRouter = require('./routers/delivery.router');
const ReportRouter = require('./routers/reporting.router');
const PaymentRouter = require('./routers/payment.router');

const path = require('path');


app.use(express.static(path.join(__dirname, 'pdf')));
app.use(cors());
app.use(express.json());


app.use('/api/v1/', RestoRouter, CategoryRouter, PlatsRouter, OrderRouter, InvoiceRouter, FactureRouter, ZoneRouter, TableRouter, DeliveryRouter, ReportRouter, PaymentRouter);

module.exports = app;