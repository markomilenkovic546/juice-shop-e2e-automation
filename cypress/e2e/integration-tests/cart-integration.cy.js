import ProductListPage from "../pages/product-list-page";
import Cart from "../pages/cart";

const productListPage = new ProductListPage();
const cart = new Cart();

beforeEach(function () {
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.data = data[1];

    // Login before each test
    cy.login(this.data.email, this.data.password);
  });

  cy.fixture("products").as("expectedProductData");
});

it("Cart creation and item addition should work properly", function () {
  // Get product list
  productListPage.getProductDiv().as("actualProducts");

  // Add first item from the list into the cart
  cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

  // Intercept the "Add item to cart" POST request
  cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
  // Open a cart page
  productListPage.header.getCartIcon().click();
  cy.wait(1500);

  cy.get("@expectedProductData").then(data => {
    const expectedProduct = data[0];

    // Store data from the intercepted "AddToCart" request
    cy.wait("@addToCart").then(interception => {
      const requestBody = interception.request.body;
      const productId = requestBody.ProductId;
      const quantity = requestBody.quantity;

      // Verify that response status code is 200
      cy.wrap(interception).its("response.statusCode").should("eq", 200);

      // Verify that correct data is sent
      assert(expectedProduct.id === productId, `"Correct Product is posted: ${productId}`);
      assert(1 === quantity, `"Correct quantity is posted: ${quantity}`);

      // Remove item from the cart
      cart.getRemoveItemButton().eq(0).click();
    });
  });
});
