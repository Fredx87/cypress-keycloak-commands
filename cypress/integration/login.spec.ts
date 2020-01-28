/// <reference types="cypress" />
/// <reference types="../../" />

describe("Keycloak Login", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("user").as("tokens");
    cy.visit("");
  });

  it("should show user as authenticated", () => {
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should have saved accessToken", () => {
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.get<KcTokens>("@tokens").should(tokens => {
      expect(tokens)
        .to.have.property("access_token")
        .to.have.length.greaterThan(0);

      expect(tokens)
        .to.have.property("id_token")
        .to.have.length.greaterThan(0);

      expect(tokens)
        .to.have.property("refresh_token")
        .to.have.length.greaterThan(0);
    });
  });

  it("should refresh tokens correctly", () => {
    cy.server();
    cy.route("post", "**/protocol/openid-connect/token").as("tokenRoute");

    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.findByText("Refresh Token").click();

    cy.wait("@tokenRoute").then(xhr => {
      expect(xhr.status).to.be.equal(200);

      const body = xhr.responseBody;

      expect(body)
        .to.have.property("access_token")
        .to.have.length.greaterThan(0);

      expect(body)
        .to.have.property("id_token")
        .to.have.length.greaterThan(0);

      expect(body)
        .to.have.property("refresh_token")
        .to.have.length.greaterThan(0);
    });
  });
});
