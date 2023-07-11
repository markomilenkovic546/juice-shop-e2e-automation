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

afterEach(() => {
  // Clear the cart after each test
  cy.clearCart()
});

describe("Tests which cover functionalities releated to cart", () => {
  it("Should successfully add a single item into the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Intercept the "Add item to cart" POST request
    cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
    // Open a cart
    productListPage.header.getCartIcon().click();
    cy.wait(1500);

    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data[0];
      cy.verifyProductDataInTheCart(expectedProduct, 0);
      // Verify that only one item is in the cart
      cart.getProductRow().should("have.length", 1);

    });
  });

  it("Should successfully add multiple items into the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    cy.wait(1500);

    // Add second item from the list into the cart
    cy.get("@actualProducts").eq(1).find(".mat-button-wrapper").click();

    // Intercept the "Add item to cart" POST request
    cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
    // Open a cart
    productListPage.header.getCartIcon().click();
    cy.wait(1500);

    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;
      cy.verifyProductDataInTheCart(expectedProduct[0], 0);
      cy.verifyProductDataInTheCart(expectedProduct[1], 1);

      // Verify that correct number of items are in the cart
      cart.getProductRow().should("have.length", 2);

      // Remove items from the cart
      cart.getRemoveItemButton().eq(0).click();
      cy.wait(1000);
      cart.getRemoveItemButton().eq(0).click();
    });
  });

  it("Total price should be correct when a single item is added to the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Intercept the "Add item to cart" POST request
    cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
    // Open a cart
    productListPage.header.getCartIcon().click();

    cy.wait(1500);
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data[0];
      cy.get("#price").then($totalPrice => {
        //cy.log(`Total Price: ${expectedProduct.price}¤`);

        // Store total price displayed on UI
        const price = $totalPrice.text();

        //cy.log(price);
        //console.log(`Total Price: ${expectedProduct.price}¤`);
        // Compare expected total price with actual total price
        expect(price).to.be.eq(`Total Price: ${expectedProduct.price}¤`);

        // Remove item from the cart
        cart.getRemoveItemButton().eq(0).click();
      });
    });
  });

  it("Total price should be corrent when 2 items are added to the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Add second item from the list into the cart
    cy.get("@actualProducts").eq(1).find(".mat-button-wrapper").click();

    // Intercept the "Add item to cart" POST request
    cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
    // Open a cart
    productListPage.header.getCartIcon().click();

    cy.wait(2000);
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;
      cy.get("#price").then($totalPrice => {
        //cy.log(`Total Price: ${expectedProduct.price}¤`);

        // Store total price displayed on UI
        const price = $totalPrice.text();

        //cy.log(price);
        //console.log(`Total Price: ${expectedProduct.price}¤`);
        // Compare expected total price with actual total price
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price + expectedProduct[1].price}¤`);

        // Remove item from the cart
        cart.getRemoveItemButton().eq(0).click();
        cy.wait(1500);
        cart.getRemoveItemButton().eq(0).click();
      });
    });
  });

  it("Should successfully remove item from the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    cy.wait(1500);

    // Add second item from the list into the cart
    cy.get("@actualProducts").eq(1).find(".mat-button-wrapper").click();

    // Intercept the "Add item to cart" POST request
    cy.intercept("POST", "https://juice-shop.herokuapp.com/api/BasketItems").as("addToCart");
    // Open a cart
    productListPage.header.getCartIcon().click();
    cy.wait(1500);

    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      // Verify that correct number of items are in the cart
      cart.getProductRow().should("have.length", 2);

      cart.getRemoveItemButton().eq(1).click();
      cy.wait(2000);
      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price}¤`);
        cy.wait(1500);
        // Remove item from the cart
        cart.getRemoveItemButton().eq(0).click();
      });
    });
  });

  it("Should successfully increase item quantity", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Open a cart
    productListPage.header.getCartIcon().click();

    // Click on the + button to increace quantity
    cart.getProductRow().find("mat-cell button:nth-of-type(2)").click();

    cy.wait(1500);

    // Verify that quantity is "2"
    cart.getProductRow().find("mat-cell span").should("have.text", " 2");
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      cy.wait(2000);

      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();

        // Verify product price in the cart
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);
        //Verify that Total price value is corerct after quantity change
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price * 2}¤`);
      });
    });
    // Remove item from the cart
    cart.getRemoveItemButton().eq(0).click();
  });

  it("Should successfully decrease item quantity", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Open a cart
    productListPage.header.getCartIcon().click();

    // Click on the + button to increace quantity
    cart.getProductRow().find("mat-cell button:nth-of-type(2)").click();

    cy.wait(1500);

     // Click on the - button to decrease quantity
     cart.getProductRow().find("mat-cell button:nth-of-type(1)").eq(0).click();

    // Verify that quantity is "1"
    cart.getProductRow().find("mat-cell span").should("have.text", " 1");
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      cy.wait(2000);

      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();

        // Verify product price in the cart
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);
        //Verify that Total price value is corerct after quantity change
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price}¤`);
      });
    });
    // Remove item from the cart
    cart.getRemoveItemButton().eq(0).click();
  });

  it("Increasing item quantity should not affect to other items quantity and price", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    cy.wait(1500);

    // Add second item from the list into the cart
    cy.get("@actualProducts").eq(1).find(".mat-button-wrapper").click();

    // Open a cart
    productListPage.header.getCartIcon().click();

    // Click on the + button to increace quantity
    cart.getProductRow().eq(1).find("mat-cell button:nth-of-type(2)").click();

    cy.wait(1500);

    // Verify that quantity is "2"
    cart.getProductRow().eq(1).find("mat-cell span").should("have.text", " 2");
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      cy.wait(2000);

      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();

        // Verify product price in the cart
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);

        //Verify that Total price value is corerct after quantity change
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price + expectedProduct[1].price * 2}¤`);
      });
    });
    // Remove items from the cart
    cart.getRemoveItemButton().eq(0).click();
    cy.wait(1500);
    cart.getRemoveItemButton().eq(0).click();
  });


  it("Total price should be correct after changing quantity to one of the 2 items in the cart", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    cy.wait(1500);

    // Add second item from the list into the cart
    cy.get("@actualProducts").eq(1).find(".mat-button-wrapper").click();

    // Open a cart
    productListPage.header.getCartIcon().click();

    // Click on the + button to increace quantity
    cart.getProductRow().eq(1).find("mat-cell button:nth-of-type(2)").click();

    cy.wait(1500);

    // Verify that quantity is "2"
    cart.getProductRow().eq(1).find("mat-cell span").should("have.text", " 2");
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      cy.wait(2000);

      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();

        // Verify product price in the cart
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);
        //Verify that Total price value is corerct after quantity change
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price + expectedProduct[1].price * 2}¤`);
      });
    });
    // Remove items from the cart
    cart.getRemoveItemButton().eq(0).click();
    cy.wait(1500);
    cart.getRemoveItemButton().eq(0).click();
  });

  it("Should successfully increase item quantity by adding item to cart twice", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();
    cy.wait(1500);

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    cy.wait(1500);

    // Open a cart
    productListPage.header.getCartIcon().click();

    // Verify that quantity is "2"
    cart.getProductRow().find("mat-cell span").should("have.text", " 2");
    cy.get("@expectedProductData").then(data => {
      const expectedProduct = data;

      cy.wait(1500);

      cy.get("#price").then($totalPrice => {
        // Store total price displayed on UI
        const price = $totalPrice.text();

        // Verify product price in the cart
        cy.verifyProductDataInTheCart(expectedProduct[0], 0);
        //Verify that Total price value is corerct after quantity change
        expect(price).to.be.eq(`Total Price: ${expectedProduct[0].price * 2}¤`);
      });
    });
    // Remove item from the cart
    cart.getRemoveItemButton().eq(0).click();
  });

  it("Should successfully proceed to checkout", function () {
    // Get product list
    productListPage.getProductDiv().as("actualProducts");

    // Add first item from the list into the cart
    cy.get("@actualProducts").eq(0).find(".mat-button-wrapper").click();

    // Open a cart
    productListPage.header.getCartIcon().click();
    cy.wait(1500);

    cart.getCheckoutButton().click();

    // Verify that correct page is open
    cy.url().should('include', 'address/select');

     // Open a cart
     productListPage.header.getCartIcon().click();
     cy.wait(1500)

    // Remove item from the cart
    cart.getRemoveItemButton().eq(0).click();
  });
});
