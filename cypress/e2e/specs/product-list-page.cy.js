import Login from "../pages/login";
import ProductListPage from "../pages/product-list-page";

const login = new Login();
const productListPage = new ProductListPage();



beforeEach(function () {
    cy.fixture("users").then(data => {
        // Store the loaded data in the 'data' variable for later use
        this.data = data[1];

        // Login before each test
        cy.login(this.data.email, this.data.password)
     });

     //cy.fixture('product-page-1').as('expectedProductData')
     cy.fixture('product-page-2').as('expectedProductData2')
     cy.fixture('product-page-3').as('expectedProductData3')
     cy.fixture('products').as('expectedProductData')
    
 });
 
 
 describe("Product List Page functionalities", () => {
    
    
    it('Validate UI Rendering of Products with Expected Data', function() {
        // Get the actual products displayed on the UI
        productListPage.getProductDiv().as('actualProducts')

        //Iterate through list of products and veify that expected data is correctly displayed on 1st page
        cy.get('@actualProducts').each(($product, index) => {
            cy.get('@expectedProductData').then((data) => {
              const expectedProduct = data[index]
      
              // Compare product name
              cy.wrap($product)
              .find('.item-name')
              .should('contain', expectedProduct.name)
      
              // Compare product image
              cy.wrap($product)
              .find('.mat-card-image')
              .should('have.attr', 'src', `assets/public/images/products/${expectedProduct.image}`)
      
              // Compare product price
              cy.wrap($product)
              .find('.ng-star-inserted')
              .should('contain', expectedProduct.price)
            })
          })
          // Navigate to the next product page
        productListPage.getNextPageButton().click({force: true})

        //Iterate through list of products and veify that expected data is correctly displayed on 2nd page
        cy.get('@actualProducts').each(($product, index) => {
            cy.get('@expectedProductData').then((data) => {
                const startIndex = 12;
                const endIndex = 24;
                const productData = data.slice(startIndex, endIndex);
                const expectedProduct = productData[index]
                console.log(productData)
      
              // Compare product name
              cy.wrap($product)
              .find('.item-name')
              .should('contain', expectedProduct.name)
      
              // Compare product image
              cy.wrap($product)
              .find('.mat-card-image')
              .should('have.attr', 'src', `assets/public/images/products/${expectedProduct.image}`)
      
              // Compare product price
              cy.wrap($product)
              .find('.ng-star-inserted')
              .should('contain', expectedProduct.price)
            })
          })

            // Navigate to the next product page
        productListPage.getNextPageButton().click({force: true})

        //Iterate through list of products and veify that expected data is correctly displayed on 3rd page
        cy.get('@actualProducts').each(($product, index) => {
            cy.get('@expectedProductData').then((data) => {
                const startIndex = 24;
                const endIndex = 36;
                const productData = data.slice(startIndex, endIndex + 1);
                const expectedProduct = productData[index]
                console.log(productData)
      
              // Compare product name
              cy.wrap($product)
              .find('.item-name')
              .should('contain', expectedProduct.name)
      
              // Compare product image
              cy.wrap($product)
              .find('.mat-card-image')
              .should('have.attr', 'src', `assets/public/images/products/${expectedProduct.image}`)
      
              // Compare product price
              cy.wrap($product)
              .find('.ng-star-inserted')
              .should('contain', expectedProduct.price)
            })
          })
      })
 });