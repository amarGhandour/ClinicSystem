const { body } = reqire("express-validator");

const clinicInputValidation = [
  body("name").isString().withMessage("Name should be a String"),
  body("location").isArray().withMessage("Location should be an Array"),
  body("email").trim().isEmail().withMessage("Email is Not Valid"),
  body("phone").isString().withMessage("Phone should be a String"),
  body("description")
    .isString()
    .isLength({ max: 100 })
    .withMessage("Description should be a String"),
  //body("services").isArray().withMessage("Services should be an Array"
];
const serviceInputValidation = [
  body("name").isString().withMessage("Name should be a String"),
  body("description")
    .isString()
    .isLength({ max: 100 })
    .withMessage("Description should be a String"),
];
