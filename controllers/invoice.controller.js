const fs = require('fs');
const path = require('path');

module.exports.getInvoiceContent = async (req, res) => {
  const invoice = req.params.name;
  const originalFilename = invoice; // Get original filename from query parameter or use invoice name as fallback
  const fileName = `${invoice}.pdf`;
  const filePath = path.join(__dirname, 'pdf', fileName);

  // // Encode the original filename
  // const encodedFilename = encodeURIComponent(originalFilename);

  // // Set headers with original filename
  // res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}.pdf"`);
  // res.setHeader('Content-Transfer-Encoding', 'binary');
  // res.setHeader('Content-Type', 'application/octet-stream');
  // res.download(filePath, fileName);

  res.attachment(fileName);

  res.sendFile(filePath);
};

