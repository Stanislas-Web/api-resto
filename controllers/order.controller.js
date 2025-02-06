

const { Facture } = require("../models/facture.model");
const { Order } = require("../models/order.model");
const { Plats } = require("../models/plats.model");
const { Resto } = require("../models/resto.model");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Invoice } = require("../models/invoice.model");
const moment = require('moment');
const { Table } = require("../models/table.model");
const { Delivery } = require("../models/delivery.model");
const { Reporting } = require("../models/reporting.model");
const stripe = require("stripe")("sk_test_51NniHpGOTC1tLYvbKvcaYSRgQxbI8KZ8886FRBidi7npWQMfauMWvS9Qv84DTEPuNbK1lBDqh4fwfA66LxeQy7yb00Hs9VEVDb")
const axios = require("axios");




module.exports.createOrder = async (req, res) => {
  const {
    name,
    idResto,
    phoneClient,
  } = req.body;



  const findPrice = await Plats.findOne({ idResto: idResto, name: name })

  const order = new Order({
    name: name,
    idResto: idResto,
    phoneClient: phoneClient,
    qte: 1,
    price: findPrice.price,
    total: findPrice.price,
    status: "pending"
  });

  const result = await order.save();


  return res.status(200).send({
    message: "Save Order",
    data: result,
  });
};


module.exports.checkOrder = async (req, res) => {
  const {
    qte,
    idResto,
    phoneClient,
  } = req.body;

  const findOrder = await Order.findOne({ idResto: idResto, phoneClient: phoneClient, status: "pending" })

  console.log(findOrder);

  const totalPrice = findOrder.price * parseInt(qte);

  const update = { qte: qte, total: totalPrice, status: "success" };
  const result = await Order.updateOne(findOrder, update);
  return res.status(201).send({
    message: "update Order datas successfully",
    data: result,
  });

};

module.exports.finishOrder = async (req, res) => {
  const { idResto, phoneClient, typePayment } = req.body;


  if (typePayment == "Cash") {
    // type Cash
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const findOrder = await Order.find({
      idResto: idResto,
      phoneClient: phoneClient,
      status: "success",
      createdAt: { $gte: twoHoursAgo }
    });

    const findRate = await Resto.findOne({ _id: idResto });

    let totalAmount = 0;
    findOrder.forEach(order => {
      totalAmount += order.total;
    });

    const factureData = Facture({
      idResto: idResto,
      phoneClient: phoneClient,
      pathPDF: "genius-" + phoneClient + "-" + Date.now(),
    });

    await factureData.save()

    const findInvoiceByPhoneNumer = await Facture.findOne({ idResto: idResto, phoneClient: phoneClient, createdAt: { $gte: twoHoursAgo } })
      .sort({ createdAt: -1 }) // Trie par date de création décroissante
      .limit(1);

    const findTable = await Table.findOne({ phoneClient: phoneClient });

    if (findTable) {

      const reportData = Reporting({
        phoneClient: phoneClient,
        idResto: idResto,
        deliveryCoast: 0,
        amountUSD: parseFloat(totalAmount),
        amountCDF: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        invoiceNumber: findInvoiceByPhoneNumer.pathPDF,
        table: findTable.no,
        status: "pending"
      });
      await reportData.save();
      await findTable.deleteOne();

      generateInvoice(findOrder, findRate, totalAmount, findInvoiceByPhoneNumer.pathPDF, idResto, phoneClient, findTable.no);

      return res.status(200).send({
        message: "get Order datas successfully",
        totalAmountCdf: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        totalAmountUsd: parseFloat(totalAmount),
        totalAmountCdfDelivery: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        totalAmountUsdDelivery: parseFloat(totalAmount),
        table: findTable.no,
        adresse: "0",
        pdfPath: findInvoiceByPhoneNumer.pathPDF,
        deliveryCoast: 0,
        adresse: "null",
        data: findOrder
      });

    } else {
      const findDeliveryCoast = await Delivery.findOne({ phoneClient: phoneClient, idResto: idResto }).sort({ _id: -1 }).limit(1);

      console.log(`mon adress: ${findDeliveryCoast.adresse}`);

      const reportData = Reporting({
        phoneClient: phoneClient,
        idResto: idResto,
        deliveryCoast: findDeliveryCoast.deliveryCoast,
        amountUSD: parseFloat(totalAmount),
        amountCDF: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        invoiceNumber: findInvoiceByPhoneNumer.pathPDF,
        table: "0",
        status: "pending"
      });
      await reportData.save();
      // await findDeliveryCoast.deleteOne();

      generateInvoiceDelivery(findOrder, findRate, totalAmount, findInvoiceByPhoneNumer.pathPDF, idResto, phoneClient, findDeliveryCoast.deliveryCoast, findDeliveryCoast.commune, findDeliveryCoast.adresse);

      return res.status(200).send({
        message: "get Order datas successfully",
        totalAmountCdf: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        totalAmountUsd: parseFloat(totalAmount),
        totalAmountCdfDelivery: parseFloat(((totalAmount + findDeliveryCoast.deliveryCoast) * findRate.rate).toFixed(2)),
        totalAmountUsdDelivery:parseFloat(totalAmount + findDeliveryCoast.deliveryCoast),
        table: findDeliveryCoast.commune,
        pdfPath: findInvoiceByPhoneNumer.pathPDF,
        deliveryCoast: findDeliveryCoast.deliveryCoast,
        adresse: findDeliveryCoast.adresse,
        data: findOrder
      });

    }




  } else {
    // type Credit Card



    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const findOrder = await Order.find({
      idResto: idResto,
      phoneClient: phoneClient,
      status: "success",
      createdAt: { $gte: twoHoursAgo }
    });

    const findRate = await Resto.findOne({ idResto: idResto });

    let totalAmount = 0;
    findOrder.forEach(order => {
      totalAmount += order.total;
    });

    const factureData = Facture({
      idResto: idResto,
      phoneClient: phoneClient,
      pathPDF: "genius-" + phoneClient + "-" + Date.now(),
    });

    await factureData.save()

    const findInvoiceByPhoneNumer = await Facture.findOne({ idResto: idResto, phoneClient: phoneClient, createdAt: { $gte: twoHoursAgo } })
      .sort({ createdAt: -1 }) // Trie par date de création décroissante
      .limit(1);

    const findTable = await Table.findOne({ phoneClient: phoneClient });

    if (findTable) {

      const reportData = Reporting({
        phoneClient: phoneClient,
        idResto: idResto,
        deliveryCoast: 0,
        amountUSD: parseFloat(totalAmount),
        amountCDF: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        invoiceNumber: findInvoiceByPhoneNumer.pathPDF,
        table: findTable.no,
        status: "pending"
      });
      await reportData.save();
      await findTable.deleteOne();

      generateInvoice(findOrder, findRate, totalAmount, findInvoiceByPhoneNumer.pathPDF, idResto, phoneClient, findTable.no);

      const items = [
        {
          amount: parseFloat((totalAmount)),
          phone: phoneClient,
          quantity: 1
        }

      ];

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: items.map(item => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Vente: ${findRate.name}, Client: ${phoneClient} vous êtes sur ${findTable.no}`
                },
                unit_amount: (item.amount) * 100,

              },
              quantity: item.quantity
            }
          }),
          success_url: `https://api-resto-74f6e5e3b4aa.herokuapp.com/api/v1/paymentsuccess/${idResto}/${phoneClient}/${findInvoiceByPhoneNumer.pathPDF}`,
          cancel_url: `https://api-resto-74f6e5e3b4aa.herokuapp.com/api/v1/paymenterror/${idResto}/${phoneClient}/${findInvoiceByPhoneNumer.pathPDF}`
        })
        return res.status(200).send({
          message: "get Order datas successfully",
          totalAmountCdf: parseFloat((totalAmount * findRate.rate).toFixed(2)),
          totalAmountUsd:parseFloat(totalAmount),
          totalAmountCdfDelivery: parseFloat((totalAmount * findRate.rate).toFixed(2)),
          totalAmountUsdDelivery: parseFloat(totalAmount),
          table: findTable.no,
          pdfPath: findInvoiceByPhoneNumer.pathPDF,
          deliveryCoast: 0,
          deliveryCoast: "null",
          urlPayment: session.url,
          data: findOrder
        });

      } catch (e) {
        res.status(500).json({ error: e.message })
      }



    } else {
      const findDeliveryCoast = await Delivery.findOne({ phoneClient: phoneClient, idResto: idResto }).sort({ _id: -1 }).limit(1);
      console.log(`my adresse : ${findDeliveryCoast.adresse}`);

      const reportData = Reporting({
        phoneClient: phoneClient,
        idResto: idResto,
        deliveryCoast: findDeliveryCoast.deliveryCoast,
        amountUSD: parseFloat(totalAmount),
        amountCDF: parseFloat((totalAmount * findRate.rate).toFixed(2)),
        invoiceNumber: findInvoiceByPhoneNumer.pathPDF,
        table: "0",
        status: "pending"
      });
      await reportData.save();
      // await findDeliveryCoast.deleteOne();

      generateInvoiceDelivery(findOrder, findRate, totalAmount, findInvoiceByPhoneNumer.pathPDF, idResto, phoneClient, findDeliveryCoast.deliveryCoast, findDeliveryCoast.commune);
      const items = [
        {
          amount: parseFloat((totalAmount + findDeliveryCoast.deliveryCoast)),
          phone: phoneClient,
          quantity: 1
        }

      ];

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: items.map(item => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Vente: ${findRate.name}, Client: ${phoneClient} votre zone de livraison est  ${findDeliveryCoast.commune}`
                },
                unit_amount: (item.amount) * 100,

              },
              quantity: item.quantity
            }
          }),
          success_url: `https://api-resto-74f6e5e3b4aa.herokuapp.com/api/v1/paymentsuccess/${idResto}/${phoneClient}/${findInvoiceByPhoneNumer.pathPDF}`,
          cancel_url: `https://api-resto-74f6e5e3b4aa.herokuapp.com/api/v1/paymenterror/${idResto}/${phoneClient}/${findInvoiceByPhoneNumer.pathPDF}`
        })
        return res.status(200).send({
          message: "get Order datas successfully",
          totalAmountCdf: parseFloat((totalAmount * findRate.rate).toFixed(2)),
          totalAmountUsd: parseFloat(totalAmount) ,
          totalAmountCdfDelivery: parseFloat(((totalAmount + findDeliveryCoast.deliveryCoast) * findRate.rate).toFixed(2)),
          totalAmountUsdDelivery: parseFloat(totalAmount + findDeliveryCoast.deliveryCoast),
          table: findDeliveryCoast.commune,
          pdfPath: findInvoiceByPhoneNumer.pathPDF,
          deliveryCoast: findDeliveryCoast.deliveryCoast,
          urlPayment: session.url,
          deliveryCoast: findDeliveryCoast.deliveryCoast,
          data: findOrder
        });
      } catch (e) {
        res.status(500).json({ error: e.message })
      }

    }



  }



};


module.exports.getAllOrder = async (req, res) => {
  const result = await Order.find();

  return res.status(200).send({
    message: "get all Order",
    data: result,
  });
};


const generateInvoiceDelivery = async (findOrder, findRate, totalAmount, name, idResto, phoneClient, deliveryCoast, zone, adresse) => {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const path = require('path');

  const totalAmountWithDeliveryCoast = totalAmount + deliveryCoast;


  const dataPDF = {
    "message": "get Order datas successfully",
    "totalAmountCdf": parseFloat((totalAmount * findRate.rate).toFixed(2)),
    "totalAmountUsd": parseFloat(totalAmount),
    "totalAmountWithDeliveryCoastCDF": parseFloat((totalAmountWithDeliveryCoast * findRate.rate).toFixed(2)),
    "totalAmountWithDeliveryCoastUSD": parseFloat(totalAmountWithDeliveryCoast),
    "deliveryCoast": deliveryCoast,
    "zone": zone,
    "adresse": adresse,
    "data": findOrder
  };


  dataPDF.data.forEach(async (order, index) => {
    const invoice = new Invoice({
      title: order.name,
      idResto: idResto,
      phoneClient: phoneClient,
      namePDF: name,
    });
    await invoice.save();
  })

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const fileName = name + '.pdf';
  const folderPath = path.join(__dirname, 'pdf'); // Chemin vers le dossier pdf
  const filePath = path.join(folderPath, fileName); // Chemin complet du fichier PDF

  // Vérifie si le dossier pdf existe, sinon le crée
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);
  generateHeader(doc, findRate);
  generateCustomerInformationDelivery(doc, dataPDF, name, findRate);
  generateInvoiceTableDelivery(doc, dataPDF);
  generateFooterTotalDelivery(doc, dataPDF);
  generateFooter(doc);



  doc.end();

  console.log(`PDF generated successfully: ${filePath}`);
  return filePath; // Renvoie le chemin du fichier PDF généré
};



const generateInvoice = async (findOrder, findRate, totalAmount, name, idResto, phoneClient, table) => {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const path = require('path');







  const dataPDF = {
    "message": "get Order datas successfully",
    "totalAmountCdf": parseFloat((totalAmount * findRate.rate).toFixed(2)),
    "totalAmountUsd": parseFloat(totalAmount),
    "table": table,
    "data": findOrder
  };






  dataPDF.data.forEach(async (order, index) => {
    const invoice = new Invoice({
      title: order.name,
      idResto: idResto,
      phoneClient: phoneClient,
      namePDF: name,
    });
    await invoice.save();
  })

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const fileName = name + '.pdf';
  const folderPath = path.join(__dirname, 'pdf'); // Chemin vers le dossier pdf
  const filePath = path.join(folderPath, fileName); // Chemin complet du fichier PDF

  // Vérifie si le dossier pdf existe, sinon le crée
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);
  generateHeader(doc);
  generateCustomerInformation(doc, dataPDF, name, findRate);
  generateInvoiceTable(doc, dataPDF);
  generateFooterTotal(doc, dataPDF);
  generateFooter(doc);

  //   doc.fontSize(18).text('Facture', { align: 'center' }).moveDown(0.5);
  //  // Path to your image


  //   doc.fontSize(14).text(`Montant Total (CDF): ${dataPDF.totalAmountCdf}`);
  //   doc.fontSize(14).text(`Montant Total (USD): ${dataPDF.totalAmountUsd}`).moveDown(0.5);

  //   doc.fontSize(16).text('Détail de la commande:', { underline: true }).moveDown(0.5);

  //   dataPDF.data.forEach((order, index) => {
  //     doc.fontSize(12).text(`Order ${index + 1}:`);
  //     doc.fontSize(10).text(`Name: ${order.name}`);
  //     doc.fontSize(10).text(`Number ID: ${order.idResto}`);
  //     doc.fontSize(10).text(`Phone Client: ${order.phoneClient}`);
  //     doc.fontSize(10).text(`Quantity: ${order.qte}`);
  //     doc.fontSize(10).text(`Price: ${order.price}`);
  //     doc.fontSize(10).text(`Total: ${order.total}`);
  //     doc.fontSize(10).text(`Status: ${order.status}`);
  //     doc.fontSize(10).text(`Created At: ${order.createdAt}`).moveDown(0.5);
  //   });

  doc.end();

  console.log(`PDF generated successfully: ${filePath}`);
  return filePath; // Renvoie le chemin du fichier PDF généré
};


module.exports.getPdf = async (req, res) => {


  const filePath = path.join(__dirname, 'pdf', 'genius-invoice-243826016607-1710001007988.pdf');
  res.sendFile(filePath);

  // const result = await Order.find();

  // return res.status(200).send({
  //   message: "get all Order",
  //   data: result,
  // });
};


async function fetchImage(src) {
  const image = await axios
      .get(src, {
          responseType: 'arraybuffer'
      })
  return image.data;
}

const fetchImageByUrl = async (src) => {
  const response = await fetch(src);
  const image = await response.buffer();

  return image;
};


async function generateHeader(doc,findRate) {

  // const urlImage = "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg";
  
  // // Téléchargement de l'image à partir de l'URL
  // const response = await axios.get(urlImage, { responseType: 'arraybuffer' });
  // const logo = Buffer.from(response.data, 'binary');

  const imagePathHeader = ""
  
  if (findRate.name == "Artcore matos") {
    const imagePath = path.join(__dirname, '../images', 'Artcore matos.png');
    doc.image(imagePath, 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(10)
      .text('Generated by', 200, 65, { align: 'right' })
      .text('Genius message', 200, 80, { align: 'right' })
      .moveDown();
    
  }else{
    const imagePath = path.join(__dirname, '../images', 'logo-genius-rogner.png');
    doc.image(imagePath, 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(10)
      .text('Generated by', 200, 65, { align: 'right' })
      .text('Genius message', 200, 80, { align: 'right' })
      .moveDown();

  }
}

function generateFooter(doc) {
  doc.fontSize(
    10,
  ).text(
    'Nous vous remercions pour votre confiance.',
    50,
    780,
    { align: 'center', width: 500 },
  );
}

function generateCustomerInformation(doc, invoice, pathPDF, findRate) {
  const shipping = invoice.data;
  const number = shipping[0].phoneClient;
  const now = moment();

  const splitTable = invoice.table.split(' ');

  doc.text(`Achat : ${number}`, 50, 170)
    .text(`N° de la facture : ${pathPDF}`, 50, 185)
    .text(`N° de la Table : ${splitTable[1]}`, 50, 200)
    .text(`Date : ${now.format(' DD-MM-YYYY  à  HH:mm:ss')}`, 50, 215)
    .text(`Vente : ${findRate.name}`, 50, 115)
    // .text(number, 300, 200)
    // .text(shipping.address, 300, 215)
    // .text(
    // 	`Kinshasa ,RDC`,
    // 	300,
    // 	130,
    // )
    .moveDown();
}


function generateCustomerInformationDelivery(doc, invoice, pathPDF, findRate) {
  const shipping = invoice.data;
  const number = shipping[0].phoneClient;
  const now = moment();


  doc.text(`Achat : +${number}`, 50, 130)
    .text(`N° de la facture : ${pathPDF}`, 50, 165)
    .text(`Adresse de livraison : commune de ${invoice.zone}, ${invoice.adresse} `, 50, 180)
    .text(`Date : ${now.format(' DD-MM-YYYY  à  HH:mm:ss')}`, 50, 195)
    .text(`Vente : ${findRate.name}`, 50, 115)
    // .text(number, 300, 200)
    // .text(shipping.address, 300, 215)
    // .text(
    // 	`Kinshasa ,RDC`,
    // 	300,
    // 	130,
    // )
    .moveDown();
}


// function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
// 	doc.fontSize(10)
// 		// .text(c1, 50, y)
// 		.text(c2, 150, y)
// 		.text(c3, 280, y, { width: 90, align: 'right' })
// 		.text(c4, 370, y, { width: 90, align: 'right' })
// 		.text(c5, 0, y, { align: 'right' });
// }


function generateTableRowHeader(doc, y, c1, c2, c3, c4) {
  doc.font('Helvetica-Bold').text(c1, 50, y + 15)
    .font('Helvetica-Bold').text(c2, 150, y + 15)
    .font('Helvetica-Bold').text(c3, 280, y + 15, { width: 90, align: 'right' })
    .font('Helvetica-Bold').text(c4, 370, y + 15, { width: 90, align: 'right' });
}


function generateTableRow(doc, y, c1, c2, c3, c4) {
  doc.text(c1, 50, y + 15)
    .text(c2, 150, y + 15)
    .text(c3, 280, y + 15, { width: 90, align: 'right' })
    .text(c4, 370, y + 15, { width: 90, align: 'right' });

}

function generateFooterTotal(doc, pdfData) {
  doc.text("Montant En FC :", 400, 500 + 15)
    .text(pdfData.totalAmountCdf, 500, 500 + 15)
    .text("Montant En USD :", 400, 520 + 15)
    .text(pdfData.totalAmountUsd, 500, 520 + 15)

}

function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 230;
  const invoiceData = invoice.data;
  generateTableRow(
    doc,
    invoiceTableTop + (0) * 30,
    "Nom du produit", "Prix unitaire ($)", "Quantité", "Total ($)"
  );

  for (i = 0; i < invoiceData.length; i++) {
    const item = invoiceData[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      item.price,
      item.qte,
      item.price * item.qte,
    );
  }
}


function generateInvoiceTableDelivery(doc, invoice) {
  let i,
    invoiceTableTop = 230;
  const invoiceData = invoice.data;
  generateTableRow(
    doc,
    invoiceTableTop + (0) * 30,
    "Nom du produit", "Prix unitaire ($)", "Quantité", "Total ($)"
  );

  for (i = 0; i < invoiceData.length; i++) {
    const item = invoiceData[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      item.price,
      item.qte,
      item.price * item.qte,
    );
  }
}


function generateFooterTotalDelivery(doc, pdfData) {
  doc.text("Montant En FC :", 400, 500 + 15)
    .text(pdfData.totalAmountCdf, 500, 500 + 15)

    .text("Montant En USD :", 400, 520 + 15)
    .text(pdfData.totalAmountUsd, 500, 520 + 15)

    .text("Frais de livraison :", 400, 540 + 15)
    .text(pdfData.deliveryCoast, 500, 540 + 15)

    .text("Total USD :", 400, 560 + 15)
    .text(`${pdfData.totalAmountWithDeliveryCoastUSD} `, 500, 560 + 15)
    .text("Total CDF :", 400, 580 + 15)
    .text(`${pdfData.totalAmountWithDeliveryCoastCDF} `, 500, 580 + 15)

}


