import Login from "../e2e/pages/product-list-page";
import ProductListPage from "../e2e/pages/product-list-page";
import Signup from "../e2e/pages/signup";
import Cart from "../e2e/pages/cart";
import CreateAddress from "../e2e/pages/create-address-page";

const login = new Login();
const productListPage = new ProductListPage();
const signup = new Signup();
const cart = new Cart();
const createAddress = new CreateAddress();

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  login.getCloseDialogButton().click();
  productListPage.header.getAccountButton().click();
  productListPage.header.getLoginButton().click();
  login.getEmailField().type(email);
  login.getPasswordField().type(password);
  login.getSubmitButton().click();
});

Cypress.Commands.add("compareProductData", ($product, expectedProduct) => {
  cy.wrap($product).find(".item-name").should("contain", expectedProduct.name);

  cy.wrap($product)
    .find(".mat-card-image")
    .should("have.attr", "src", `assets/public/images/products/${expectedProduct.image}`);

  cy.wrap($product).find(".ng-star-inserted").should("contain", expectedProduct.price);
});

Cypress.Commands.add("compareProductDetailsData", ($product, expectedProduct) => {
  cy.wrap($product).find(".mat-tooltip-trigger.product").click();

  productListPage.productDetailsModal.getProductDetailsModal().find("h1").should("contain", expectedProduct.name);

  productListPage.productDetailsModal
    .getProductDetailsModal()
    .find("div")
    .should("contain", expectedProduct.description);

  productListPage.productDetailsModal
    .getProductDetailsModal()
    .find("img")
    .should("have.attr", "src", `assets/public/images/products/${expectedProduct.image}`);

  productListPage.productDetailsModal
    .getProductDetailsModal()
    .find(".item-price")
    .should("contain", expectedProduct.price);

  productListPage.productDetailsModal.getCloseDialogButton().click();
});

Cypress.Commands.add("submitSignupForm", (email, password, securityAnswer) => {
  // Enter the valid email into the "Email" field
  signup.getEmailField().type(email);

  // Enter the valid password into the "Password" field
  signup.getPasswordField().type(password);

  // Enter the valid password into the "Repeat field password field"
  signup.getRepeatPasswordFiled().type(password);

  // Wait 1500 miliseconds
  cy.wait(1500);

  // Open the "Security question" drop down
  signup.getSecurityQuestionDropDown().click();

  // Select the question "Number of one of your customer or ID cards"
  signup.getSecurityQuestion().click();

  // Type answer into the "Security answer" field
  signup.getSecurityAnswerField().type(securityAnswer);

  // Submit the "Signup" form
  signup.getRegisterButton().click();
});

Cypress.Commands.add("postReview", () => {
  // Get the actual products displayed on the UI
  productListPage.getProductDiv().as("actualProducts");

  // Open "Product details" modal for the first product
  cy.get("@actualProducts").eq(0).find(".mat-tooltip-trigger.product").click();

  cy.wait(1500);
  // Type review into the the Review text box
  productListPage.productDetailsModal.getReviewMessageTextBox().type("such a nice juice");

  cy.wait(1500);

  // Submit review
  productListPage.productDetailsModal.getSubmitReviewButton().click();

  // Expand "Reviews" drop down
  productListPage.productDetailsModal.getReviewsDropDown().click();
});

Cypress.Commands.add("verifyProductDataInTheCart", (expectedProduct, productIndex) => {
  cart.getProductRow().as("product-row");
  cy.get("@product-row")
    .eq(productIndex)
    .then(product => {
      // Verify product name in the cart
      cy.wrap(product)
        .find(".mat-cell.cdk-cell.cdk-column-product.mat-column-product.ng-star-inserted")
        .should("contain", expectedProduct.name);

      // Verify product image in the cart
      cy.wrap(product).find("img").should("have.attr", "src", `assets/public/images/products/${expectedProduct.image}`);

      // Verify product price in the cart
      cy.wrap(product).find(".cdk-column-price").should("contain", expectedProduct.price);
    });
});

Cypress.Commands.add("proceedToSelectAddressPage", () => {
  // Get product list
  productListPage.getProductDiv().as("actualProducts");

  // Add first item from the list into the cart
  cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

  // Open a cart
  productListPage.header.getCartIcon().click();
  cy.wait(1500);

  cart.getCheckoutButton().click();

  // Verify that correct page is open
  cy.url().should("include", "address/select");
});

Cypress.Commands.add("clearCart", () => {
  // Open a cart
  productListPage.header.getCartIcon().click();
  cy.wait(1500);

  cart.getProductRow().as("product-row");
  cy.get("@product-row").each((products, index) => {
    cy.wait(1500);
    if (products) {
      cy.wrap(products).find(".cdk-column-remove > .mat-focus-indicator").click();
    }
  });
});


Cypress.Commands.add("fillNewAddressForm", address => {
  createAddress.getCountryInputField().type(address.country);
  createAddress.getNameInputField().type(address.name);
  createAddress.getMobileNumberInputField().type(address.mobileNumber);
  createAddress.getZipCodeInputField().type(address.zip);
  createAddress.getAddressTextBoxInputField().type(address.address);
  createAddress.getCityInputField().type(address.city);
  createAddress.getStateInputField().type(address.state);
});


