const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");

const generatePDF = async (delivery) => {

  const dir = path.join(__dirname, "../pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, `${delivery.trackingId}.pdf`);

  const doc = new PDFDocument({ margin: 40 });

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // ===============================
  // LOGO
  // ===============================

  const logoPath = path.join(__dirname, "../assets/logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 100 });
  }

  // HEADER TITLE
  doc
    .fontSize(22)
    .fillColor("#0a3d62")
    .text("Courier Delivery Receipt", 200, 40, { align: "center" });

  doc.moveDown(3);

  // ===============================
  // TRACKING BOX
  // ===============================

  doc
    .rect(40, doc.y, 520, 40)
    .fillAndStroke("#f1f2f6", "#2f3542");

  doc
    .fillColor("black")
    .fontSize(16)
    .text(`Tracking ID: ${delivery.trackingId}`, 60, doc.y - 30);

  doc.moveDown(2);

  // ===============================
  // SENDER + RECEIVER BOX
  // ===============================

  const boxY = doc.y;

  doc.rect(40, boxY, 250, 120).stroke();
  doc.rect(310, boxY, 250, 120).stroke();

  doc.fontSize(14).text("Sender", 50, boxY + 10);
  doc.moveDown(0.5);

  doc.fontSize(11)
    .text(`Name: ${delivery.senderName}`, 50)
    .text(`Phone: ${delivery.senderPhone}`, 50)
    .text(`Address: ${delivery.senderAddress}`, 50);

  doc.fontSize(14).text("Receiver", 320, boxY + 10);

  doc.fontSize(11)
    .text(`Name: ${delivery.receiverName}`, 320)
    .text(`Phone: ${delivery.receiverPhone}`, 320)
    .text(`Address: ${delivery.receiverAddress}`, 320);

  doc.moveDown(6);

  // ===============================
  // DELIVERY DETAILS TABLE
  // ===============================

  doc.moveDown();

  doc.fontSize(14).text("Shipment Details", { underline: true });

  doc.moveDown(1);

  const startY = doc.y;

  doc.rect(40, startY, 520, 100).stroke();

  doc.fontSize(11);

  doc.text(`From: ${delivery.originCity}`, 50, startY + 10);
  doc.text(`To: ${delivery.destinationCity}`, 50);

  doc.text(`Package Type: ${delivery.packageType}`, 300, startY + 10);
  doc.text(`Weight: ${delivery.weight} kg`, 300);

  doc.text(`Delivery Type: ${delivery.deliveryType}`, 50);
  doc.text(`Payment Method: ${delivery.paymentMethod}`, 300);

  doc.moveDown(6);

  // ===============================
  // BARCODE
  // ===============================

  const barcode = await bwipjs.toBuffer({
    bcid: "code128",
    text: delivery.trackingId,
    scale: 3,
    height: 10
  });

  doc.moveDown();

  doc.fontSize(12).text("Tracking Barcode", { align: "center" });

  doc.image(barcode, doc.page.width / 2 - 120, doc.y, { width: 240 });

  doc.moveDown(4);

  // ===============================
  // QR CODE
  // ===============================

  const qrData = `http://localhost:3000/track/${delivery.trackingId}`;

  const qrImage = await QRCode.toDataURL(qrData);

  const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");

  doc.fontSize(12).text("Scan QR Code to Track Shipment", {
    align: "center"
  });

  doc.image(qrBuffer, doc.page.width / 2 - 50, doc.y + 10, { width: 100 });

  doc.moveDown(6);

  // ===============================
  // FOOTER
  // ===============================

  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "Thank you for using our courier service. Keep this receipt for tracking your shipment.",
      { align: "center" }
    );

  doc.end();

  await new Promise((resolve) => stream.on("finish", resolve));

  return filePath;
};

module.exports = generatePDF;