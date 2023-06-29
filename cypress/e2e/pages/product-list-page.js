import Header from "../components/header";
import ProductDetailsModal from "../components/product-details-modal";

export default class ProductListPage {
  constructor() {
    this.header = new Header();
    this.productDetailsModal = new ProductDetailsModal();
  }

  //Get "email" field
  getEmailField() {
    return cy.get('[name="email"]');
  }

  //Get "password" field
  getPasswordField() {
    return cy.get('[name="password"]');
  }

  // Get submit login form button
  getSubmitButton() {
    return cy.get("#loginButton");
  }

  //Get login modal div
  getLoginModal() {
    return cy.get(".mat-card");
  }

  // Get close dialog button
  getCloseDialogButton() {
    return cy.get(".close-dialog");
  }

  // Get product article
  getProductDiv() {
    return cy.get(".mat-card.mat-focus-indicator.mat-elevation-z6.ribbon-card");
  }

  // Get Next page button
  getNextPageButton() {
    return cy.get(".mat-paginator-navigation-next");
  }

  // Get previous button
  getPreviousPageButton() {
    return cy.get(".mat-paginator-navigation-previous");
  }

  // Get items per page closed drop-down
  getItemsPerPageDropDown() {
    return cy.get(".mat-select-arrow-wrapper");
  }

  // Get reviews drop-down
  getReviewsDropDown() {
    return cy.get("#mat-expansion-panel-header-1");
  }

  // Get expanded Items per page drop-down
  getOpenItemsPerPageDropdown() {
    return cy.get("#mat-select-6-panel");
  }

  // Get selected "Items per page" option from drop-down
  getSelectedItemsPerPageOption() {
    return cy.get('.mat-select-min-line')
  }

  // Get info about currently applied pagination
  getCurrentPageInfo() {
    return cy.get('.mat-paginator-range-label')
  }


}
