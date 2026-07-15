Feature: Product search
  As a shopper on the Sauce Demo storefront
  I want to search for products by name
  So that I can quickly find items I'm interested in

  Scenario: Searching a known product term returns that product
    Given I am on the search page
    When I search for "jacket"
    Then the results page URL should contain "q=jacket"
    And a result containing "jacket" should be visible
