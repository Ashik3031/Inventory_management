const router = require("express").Router();
const controller = require("../controller/productController");
const auth = require("../middleware/authMiddleware");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/add", controller.addProduct);
router.put("/edit/:id", controller.editProduct);
router.delete("/:id", controller.deleteProduct); 
router.get("/stats", controller.getInventoryStats);
router.get("/recent", controller.getRecentProducts);

module.exports = router;
     