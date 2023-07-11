import Header from "../components/header";

export default class SelectAddress {
  constructor() {
    this.header = new Header();
  }

  // Get "New addres" button
  getNewAddressButton() {
    return cy.get('[aria-label="Add a new address"]');
  }

  // Get "Continue" button
  getContinueButton() {
    return cy.get('[aria-label="Proceed to payment selection"]');
  }

  // Get "Select address" radio button

  getSelectAdressRadio() {
    return cy.get('.mat-row > .cdk-column-Selection')
  }
}
