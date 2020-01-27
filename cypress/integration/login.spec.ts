/// <reference types="cypress" />
/// <reference types="../../" />

describe("Keycloak Login", () => {
	beforeEach(() => {
		cy.kcLogout();
		cy.kcLogin("user").as("accessToken");
		cy.visit("/");
	});

	it("should show user as authenticated", () => {
		cy.get("#output").should("contain.text", "Init Success (Authenticated)");
	});

	it("should have saved accessToken", () => {
		cy.get("@accessToken").should("have.length.greaterThan", 0);
	});
});
