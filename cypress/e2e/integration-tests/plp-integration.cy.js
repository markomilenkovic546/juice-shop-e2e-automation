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

it("Validate UI Rendering of Products with Expected Data", function () {
  // Get the actual products displayed on the UI
  productListPage.getProductDiv().as("actualProducts");

  //Iterate through list of products and veify that expected data is correctly displayed on 1st page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data[index];

      // Compare expected data with actual data on the page
      cy.compareProductData($product, expectedProduct);
    });
  });
  // Navigate to the next product page
  productListPage.getNextPageButton().click({ force: true });

  //Iterate through list of products and veify that expected data is correctly displayed on 2nd page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      // Extract 2nd page items from products.json data and store it in the expectedProduct array
      const startIndex = 12;
      const endIndex = 24;
      const productData = data.slice(startIndex, endIndex);
      const expectedProduct = productData[index];
      console.log(productData);

      // Compare expected data with actual data on the page
      cy.compareProductData($product, expectedProduct);
    });
  });

  // Navigate to the next product page
  productListPage.getNextPageButton().click({ force: true });

  //Iterate through list of products and veify that expected data is correctly displayed on 3rd page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      // Extract 3rd page items from products.json data and store it in the expectedProduct array
      const startIndex = 24;
      const endIndex = 36;
      const productData = data.slice(startIndex, endIndex + 1);
      const expectedProduct = productData[index];
      console.log(productData);

      // Compare expected data with actual data on the page
      cy.compareProductData($product, expectedProduct);
    });
  });
});

it("Product details modal should contain correct data correctly displayed", function () {
  // Get the actual products displayed on the UI
  productListPage.getProductDiv().as("actualProducts");

  //Iterate through list of products and veify that expected data is correctly displayed on 1st page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data[index];
      cy.compareProductDetailsData($product, expectedProduct);
    });
  });

  // Navigate to the next product page
  productListPage.getNextPageButton().click({ force: true });

  //Iterate through list of products and veify that expected data is correctly displayed on 1st page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      // Extract 2nd page items from products.json data and store it in the expectedProduct array
      const startIndex = 12;
      const endIndex = 24;
      const productData = data.slice(startIndex, endIndex);
      const expectedProduct = productData[index];
      console.log(productData);
      cy.compareProductDetailsData($product, expectedProduct);
    });
  });

  // Navigate to the next product page
  productListPage.getNextPageButton().click({ force: true });

  //Iterate through list of products and veify that expected data is correctly displayed on 1st page
  cy.get("@actualProducts").each(($product, index) => {
    cy.get("@expectedProductData").then(data => {
      // Extract 3rd page items from products.json data and store it in the expectedProduct array
      const startIndex = 24;
      const endIndex = 36;
      const productData = data.slice(startIndex, endIndex + 1);
      const expectedProduct = productData[index];
      console.log(productData);
      cy.compareProductDetailsData($product, expectedProduct);
    });
  });
});

it("Should successfully post review message", function () {
  // Interercept PUT request
  cy.intercept("PUT", " https://juice-shop.herokuapp.com/rest/products/1/reviews").as("reviews");

  //Post review
  cy.postReview();

  // Store data from the intercepted PUT request
  cy.wait("@reviews").then(interception => {
    const requestBody = interception.request.body;
    const message = requestBody.message;
    const author = requestBody.author;

    // Verify that response status code is 200
    cy.wrap(interception).its("response.statusCode").should("eq", 201);

    // Verify that correct review message is sent
    assert(message === "such a nice juice", `"Correct review message is sent: ${message}`);

    // Verify that correct author email is sent
    assert(author === this.data.email, `"Correct author email is sent: ${author}`);
  });
});
