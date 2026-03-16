const express=require("express");
const router=express.Router();

const {
getDeliveries,
approveDelivery,
rejectDelivery,
updateDelivery,
deleteDelivery
}=require("../controllers/adminControllerDomestic");

router.get("/deliveries",getDeliveries);

router.put("/approve/:id",approveDelivery);

router.put("/reject/:id",rejectDelivery);

router.put("/update/:id",updateDelivery);

router.delete("/delete/:id",deleteDelivery);

module.exports=router;