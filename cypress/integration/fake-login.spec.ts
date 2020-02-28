/// <reference types="cypress" />
/// <reference types="../../" />

describe("Keycloak Fake Login", () => {
  it("should show user as authenticated", () => {
    cy.kcFakeLogin("user");
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should get user data equal to fixture data", () => {
    cy.kcFakeLogin("user");
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.findByText("Get Profile").click();

    cy.fixture("users/user.json").then((userData: UserData) => {
      cy.get("#output").should(el => {
        const value = JSON.parse(el.text());
        expect(value).to.deep.equal(userData.fakeLogin?.account);
      });
    });
  });

  it("should go to the specified path with hash and show user as authenticated", () => {
    cy.kcFakeLogin("user", "#/foobar");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/#/foobar`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should go to the specified path without hash and show user as authenticated", () => {
    cy.kcFakeLogin("user", "index.html");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });
});
