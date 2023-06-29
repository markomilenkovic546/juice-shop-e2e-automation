import Header from "../components/header";

export default class Cart {
  constructor() {
    this.header = new Header();
  }

  // Get "Cart" modal
  getEmailField() {
    return cy.get('.mat-card.mat-focus-indicator.mat-elevation-z6');
  }

  // Get product row from cart modal
  getProductRow() {
    return cy.get('.mat-row.cdk-row.ng-star-inserted')
  }

  // Get remove item button (remove from teh cart)

  getRemoveItemButton() {
    return cy.get('.cdk-column-remove > .mat-focus-indicator')
  }
}