/// <reference types="cypress" />
/// <reference types="../../" />

describe("Keycloak Fake Login", () => {
  beforeEach(() => {
    cy.kcFakeLogin("user");
  });

  it("should show user as authenticated", () => {
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should get user data equal to fixture data", () => {
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.findByText("Get Profile").click();

    cy.fixture("users/user.json").then((userData: UserData) => {
      cy.get("#output").should(el => {
        const value = JSON.parse(el.text());
        expect(value).to.deep.equal(userData.fakeLogin?.account);
      });
    });
  });
});
