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
});
