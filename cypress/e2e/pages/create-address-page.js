import Header from "../components/header";

export default class createAddress {
  constructor() {
    this.header = new Header();
  }

  // Get "Country" input field
  getCountryInputField() {
    return cy.get('[data-placeholder="Please provide a country."]');
  }

  // Get "Name" input field
  getNameInputField() {
    return cy.get('[data-placeholder="Please provide a name."]');
  }

  // Get "Number" input field
  getMobileNumberInputField() {
    return cy.get('[data-placeholder="Please provide a mobile number."]');
  }

  // Get "ZipCode" input field
  getZipCodeInputField() {
    return cy.get('[data-placeholder="Please provide a ZIP code."]');
  }

  // Get "Address" text box field
  getAddressTextBoxInputField() {
    return cy.get('[data-placeholder="Please provide an address."]');
  }

  // Get "City" input field
  getCityInputField() {
    return cy.get('[data-placeholder="Please provide a city."]');
  }

  // Get "State" input field
  getStateInputField() {
    return cy.get('[data-placeholder="Please provide a state."]');
  }

  // Get "Back" button
  getBackButton() {
    return cy.get("button.btn-return");
  }

  // Get "Submit" button
  getSubmitButton() {
    return cy.get("#submitButton");
  }
}
