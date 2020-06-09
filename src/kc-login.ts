import {createRequestBodyForToken, getAuthCodeFromLocation} from './utils';

Cypress.Commands.add("kcLogin", (user: string) => {
  Cypress.log({ name: "Login" });

  cy.fixture(`users/${user}`).then((userData: UserData) => {
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");
    const client_id = Cypress.env("auth_client_id");
    const client_secret = Cypress.env("auth_client_secret");

    cy.request({
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      followRedirect: false,
      qs: {
        scope: "openid",
        response_type: "code",
        approval_prompt: "auto",
        redirect_uri: Cypress.config("baseUrl"),
        client_id
      }
    })
      .then(response => {
        const html = document.createElement("html");
        html.innerHTML = response.body;

        const form = html.getElementsByTagName("form")[0];
        const url = form.action;

        return cy.request({
          method: "POST",
          url,
          followRedirect: false,
          form: true,
          body: {
            username: userData.username,
            password: userData.password
          }
        });
      })
      .then(response => {
        const code = getAuthCodeFromLocation(response.headers["location"]);

        cy.request({
          method: "post",
          url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
          body: createRequestBodyForToken(client_id, client_secret, Cypress.config("baseUrl"), code),
          form: true,
          followRedirect: false
        }).its("body");
      });
  });
});
