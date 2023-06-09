import Login from "../e2e/pages/product-list-page";
import ProductListPage from "../e2e/pages/product-list-page";

const login = new Login();
const productListPage = new ProductListPage();

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
