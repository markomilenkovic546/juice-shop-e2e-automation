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

  getSignUpLink() {
    return cy.get("#newCustomerLink > .primary-link");
  }

  getCloseDialogButton() {
    return cy.get(".close-dialog");
  }

  getProductDiv() {
    return cy.get(".mat-card.mat-focus-indicator.mat-elevation-z6.ribbon-card");
  }

  getNextPageButton() {
    return cy.get(".mat-paginator-navigation-next");
  }

  getPreviousPageButton() {
    return cy.get(".mat-paginator-navigation-previous");
  }

  getItemsPerPageDropDown() {
    return cy.get(".mat-select-arrow-wrapper");
  }

  getReviewsDropDown() {
    return cy.get("#mat-expansion-panel-header-1");
  }

  getOpenItemsPerPageDropdown() {
    return cy.get("#mat-select-6-panel");
  }

  getSelectedItemsPerPageOption() {
    return cy.get('.mat-select-min-line')
  }

  getCurrentPageInfo() {
    return cy.get('.mat-paginator-range-label')
  }
}
