const mongoose = require("mongoose");

const internationalSchema = new mongoose.Schema({

trackingId:{
type:String,
unique:true
},

senderName:String,
senderPhone:String,
senderEmail:String,
senderAddress:String,
senderCountry:String,

receiverName:String,
receiverPhone:String,
receiverEmail:String,
receiverAddress:String,
receiverCountry:String,

originCity:String,
destinationCity:String,

packageType:String,
weight:Number,
length:Number,
width:Number,
height:Number,

itemDescription:String,
itemValue:Number,

deliveryType:String,
paymentMethod:String,

approvalStatus:{
type:String,
default:"Pending"
},

deliveryStatus:{
type:String,
default:"Processing"
}

},{timestamps:true});

module.exports = mongoose.model(
"InternationalDelivery",
internationalSchema
);