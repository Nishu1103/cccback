const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.fields([
    { name: "propertyImages", maxCount: 6 },
    { name: "planLayouts", maxCount: 6 },
  ]),
  createProperty
);

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put(
  "/:id",
  upload.fields([
    { name: "propertyImages", maxCount: 6 },
    { name: "planLayouts", maxCount: 6 },
  ]),
  updateProperty
);
router.delete("/:id", deleteProperty);

module.exports = router;
