import ProductListPage from "../pages/product-list-page";
import Cart from "../pages/cart";
import SelectAddress from "../pages/select-address-page";

const productListPage = new ProductListPage();
const cart = new Cart();
const selectAddress = new SelectAddress();

beforeEach(function () {
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.data = data[1];

    // Login before each test
    cy.login(this.data.email, this.data.password);
  });
  // Proc
  cy.proceedToSelectAddressPage();
  cy.fixture("products").as("expectedProductData");
});

afterEach(() => {
  // Clear the cart after each test
  cy.clearCart();
});

describe("Tests which cover functionalities of select-address page", () => {
  it("Navigate to create address page", function () {
    // Click on the "New address" button
    selectAddress.getNewAddressButton().click();
    // Verify that create-page is open
    cy.url().should("include", "/address/create");
  });

  it.only("Select address and proceed to Select delivery method page", function () {
    cy.fixture("addresses/correct-address-data.json").then(address => {
      // Select address
      selectAddress.getSelectAdressRadio().eq(0).click();
      // Click on the "Continue" button
      selectAddress.getContinueButton().click();
      // Verify that Delivery method page is open
      cy.url().should("include", "/delivery-method");
    });
  });
});
