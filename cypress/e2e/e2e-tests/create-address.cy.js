import ProductListPage from "../pages/product-list-page";
import Cart from "../pages/cart";
import SelectAddress from "../pages/select-address-page";
import CreateAddress from "../pages/create-address-page";

const productListPage = new ProductListPage();
const cart = new Cart();
const selectAddress = new SelectAddress();
const createAddress = new CreateAddress();

beforeEach(function () {
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.data = data[1];

    // Login before each test
    cy.login(this.data.email, this.data.password);
  });
  // Proc
  cy.proceedToSelectAddressPage();
  selectAddress.getNewAddressButton().click();
});

after(() => {
  // Clear the cart after all
  cy.clearCart();
});

describe("Tests which cover functionalities of select-address page", () => {
  it("Should successfully create address", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      cy.fillNewAddressForm(address);
      createAddress.getSubmitButton().click();
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Go back to Select-address page", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getBackButton().click();
      cy.url().should("include", "/address/select");
    });
  });

  it("Should not be posible to submit form when Country field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "Country" field
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Should not be posible to submit form when Name field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "Name" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
    });
    createAddress.getSubmitButton().should("be.disabled");
  });

  it("Should not be posible to submit form when Mobile field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "Mobile number" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Should not be posible to submit form when Zip field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "Zip" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Should not be posible to submit form when Address text-box is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "Address" text-box
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Should not be posible to submit form when City field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "City" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Should be posible to submit form when State field is empty", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields except "State" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Country field should accept numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type("12345");
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Country field should accept combo of letters and numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country + "123");
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Country field should accept combo of letters and special characters", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country + "#");
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Name field should accept combo of letters and numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name + "123");
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Name field should accept combo of letters and special characters", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name + "#");
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Zip field should accept only numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getZipCodeInputField().should("have.attr", "type", "number");
    });
  });

  it("Zip field should not accept more than 8 figures ", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type("111111111");
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("City field should accept combo of letters and numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city + "1");
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city + "1"} has been successfully added to your addresses.`);
    });
  });

  it("City field should accept combo of letters and special characters", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city + "#");
      createAddress.getStateInputField().type(address.state);
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city + "#"} has been successfully added to your addresses.`);
    });
  });

  it("State field should accept combo of letters and numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state + "1");
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("State field should accept combo of letters and special characters", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type(address.mobileNumber);
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      createAddress.getStateInputField().type(address.state + "#");
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Mobile field should not accept more than 10 figures", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields and type 11 numbers in the "Mobile number" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type("11111111111");
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      // Verify that "Submit" button is displayed
      createAddress.getSubmitButton().should("be.disabled");
    });
  });

  it("Mobile number field should accept 10 numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Fill all fields and type 10 numbers in the "Mobile number" field
      createAddress.getCountryInputField().type(address.country);
      createAddress.getNameInputField().type(address.name);
      createAddress.getMobileNumberInputField().type("1111111111");
      createAddress.getZipCodeInputField().type(address.zip);
      createAddress.getAddressTextBoxInputField().type(address.address);
      createAddress.getCityInputField().type(address.city);
      // Click on the "Submit" button
      createAddress.getSubmitButton().click();
      // Verify that appropriate message is displayed about successfully added message
      cy.get("body").contains(`The address at ${address.city} has been successfully added to your addresses.`);
    });
  });

  it("Mobile number field should accept only numbers", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Verify that "Mobile number" field accept only numbers
      createAddress.getMobileNumberInputField().should("have.attr", "type", "number");
    });
  });
});
