Cypress.Commands.add("kcLogout", () => {
  Cypress.log({ name: "Logout" });
  const authBaseUrl = Cypress.env("auth_base_url");
  const realm = Cypress.env("auth_realm");

  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`
  });
});
