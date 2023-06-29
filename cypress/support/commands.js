import Login from "../e2e/pages/product-list-page";
import ProductListPage from "../e2e/pages/product-list-page";
import Signup from "../e2e/pages/signup";

const login = new Login();
const productListPage = new ProductListPage();
const signup = new Signup();

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  login.getCloseDialogButton().click();
  productListPage.header.getAccountButton().click();
  productListPage.header.getLoginButton().click();
  login.getEmailField().type(email);
  login.getPasswordField().type(password);
  login.getSubmitButton().click();
});


Cypress.Commands.add('compareProductData', ($product, expectedProduct) => {
  cy.wrap($product)
    .find('.item-name')
    .should('contain', expectedProduct.name);

  cy.wrap($product)
    .find('.mat-card-image')
    .should('have.attr', 'src', `assets/public/images/products/${expectedProduct.image}`);

  cy.wrap($product)
    .find('.ng-star-inserted')
    .should('contain', expectedProduct.price);
});


Cypress.Commands.add('compareProductDetailsData', ($product, expectedProduct) => {
  cy.wrap($product)
  .find('.mat-tooltip-trigger.product')
  .click();

  productListPage.productDetailsModal.getProductDetailsModal()
  .find('h1')
  .should('contain', expectedProduct.name);

  productListPage.productDetailsModal.getProductDetailsModal()
  .find('div')
  .should('contain', expectedProduct.description);

  productListPage.productDetailsModal.getProductDetailsModal()
  .find('img')
  .should('have.attr', 'src', `assets/public/images/products/${expectedProduct.image}`);
 

  productListPage.productDetailsModal.getProductDetailsModal()
  .find('.item-price')
  .should('contain', expectedProduct.price);

  productListPage.productDetailsModal.getCloseDialogButton().click()
    
  
});


Cypress.Commands.add("submitSignupForm", (email, password, securityAnswer) => {
    // Load users data from a users.json file
    
    
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

    Cypress.Commands.add('postReview', () => {
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