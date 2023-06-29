import Login from "../pages/login";
import ProductListPage from "../pages/product-list-page";

const login = new Login();
const productListPage = new ProductListPage();

beforeEach(function () {
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.data = data[1];

    // Login before each test
    cy.login(this.data.email, this.data.password);
  });

  cy.fixture("products").as("expectedProductData");
});

describe("Product List Page functionalities", () => {
 
  it("Should successfully post review message", function () {
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

    //Verify that submitetd Review is displayed on UI
    cy.get("cite").should("contain", this.data.email);
    cy.get("p").should("contain", "such a nice juice");

  });

  it("Should successfully open 'Product details' modal", function () {
    // Open 'Product details' modal
    productListPage.getProductDiv().eq(0).click();

    // Verify that modal is open
    productListPage.productDetailsModal.getProductDetailsModal().should("be.visible");
  });

  it("Should successfully close 'Product details' modal", function () {
    // Open 'Product details' modal
    productListPage.getProductDiv().eq(0).click();

    // Click on the "Close" button
    productListPage.productDetailsModal.getCloseDialogButton().click();

    // Verify that modal is closed
    productListPage.productDetailsModal.getProductDetailsModal().should("not.exist");
  });
});

describe("Pagination functionalities", () => {
  it("'Items per page' drop-down should contains 3 expected options", function () {
    //Open "Items per page" drop-down menu
    productListPage.getItemsPerPageDropDown().click();
    const options = [];
    const expectedOptions = [12, 24, 36];

    // Get avaliable "Items per page" options
    cy.get('[role="option"]')
      .each(($option, index) => {
        const optionText = $option.text();
        const option = Number(optionText);
        options.push(option);
      })
      .then(() => {
        // Compare avaliable "Items per page" options with expected options
        expect(options).to.deep.equal(expectedOptions);
      });
  });

  it("12 items per page option should be default option", function () {
    //Open "Items per page" drop-down menu
    productListPage.getItemsPerPageDropDown().click();

    // Verify that correct option is selected
    productListPage.getSelectedItemsPerPageOption().contains("12");

    // Verify that number of displayed products per page is 12
    productListPage.getProductDiv().should("have.length", 12);
  });

  it("24 items per page option should be applied successfully", function () {
    //Open "Items per page" drop-down menu
    productListPage.getItemsPerPageDropDown().click();

    // Get avaliable "Items per page" options
    cy.get('[role="option"]').contains("24").click();

    // Verify that correct option is selected
    productListPage.getSelectedItemsPerPageOption().contains("24");

    // Verify that number of displayed products per page is 24
    productListPage.getProductDiv().should("have.length", 24);
  });

  it("36 items per page option should be applied successfully", function () {
    //Open "Items per page" drop-down menu
    productListPage.getItemsPerPageDropDown().click();

    // Get avaliable "Items per page" options
    cy.get('[role="option"]').contains("36").click();

    // Verify that correct option is selected
    productListPage.getSelectedItemsPerPageOption().contains("36");

    // Verify that number of displayed products per page is 24
    productListPage.getProductDiv().should("have.length", 35);
    // 35 is a total number of avaliable prodcuts, so can not be displayed 36
  });

  it("Should successfully navigate to next page", function () {
    // Wait page to rerender
    cy.wait(1500);

    // Click on the "Next page" button
    productListPage.getNextPageButton().click({ force: true });

    // Verify that next product page is correctly loaded
    productListPage.getCurrentPageInfo().should("have.text", " 13 – 24 of 35 ");

    // Verify that number of displayed products is correct
    productListPage.getProductDiv().should("have.length", 12);
  });

  it("Should successfully navigate to previous page page", function () {
    // Wait page to rerender
    cy.wait(1500);

    // Click on the "Next page" button
    productListPage.getNextPageButton().click({ force: true });

    // Click on the "Previous page" button
    productListPage.getPreviousPageButton().click({ force: true });

    // Verify that next product page is correctly loaded
    productListPage.getCurrentPageInfo().should("have.text", " 1 – 12 of 35 ");

    // Verify that number of displayed products is correct
    productListPage.getProductDiv().should("have.length", 12);
  });
});
