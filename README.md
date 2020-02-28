# cypress-keycloak-commands
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Cypress commands for login with [Keycloak](https://www.keycloak.org/).

- Setup Keycloak configuration from Cypress configuration or environment variables
- Use Fixtures to store users data
- Returns you the tokens of the logged user for calling backend APIs from your test code
- Fake login command for integration testing
- Tested with Keycloak 4.8, 5, 6, 7 and 8

## Usage

### Installing

Install the package using npm:

```
npm i -D cypress-keycloak-commands
```

or Yarn:

```
yarn add -D cypress-keycloak-commands
```

Import the package in the file `cypress/support/commands.js` (or `cypress/support/commands.ts`):

```typescript
import "cypress-keycloak-commands";
```

### Setup Keycloak configuration

Setup the Keycloak configuration in `cypress.json` configuration file:

```json
{
  "env": {
    "auth_base_url": "https://auth.server/auth",
    "auth_realm": "my_realm",
    "auth_client_id": "my_client_id"
  }
}
```

You can override this settings for some tests using [Enviroment variabiles](https://docs.cypress.io/guides/guides/environment-variables.html).

### Login commands for E2E Tests

For logging in with Keycloak you must create a [fixture](https://docs.cypress.io/api/commands/fixture.html) containing the user credentials under the directory `cypress/fixtures/users`. For example you can create a file `cypress/fixtures/users/user.json` with this content:

```json
{
  "username": "user",
  "password": "password"
}
```

When you have a fixture you can login using the `kcLogin` command, passing the name of the fixture, and you can perform a logout using the `kcLogout` command:

```typescript
describe("Keycloak Login", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("user");
    cy.visit("/");
  });
});
```

You should always perform logout _before_ logging in a user, following the best practice of [cleaning the state in the beforeEach hook](https://docs.cypress.io/guides/references/best-practices.html#Using-after-or-afterEach-hooks).

#### Get user tokens for calling APIs from E2E tests

If you need to call backend APIs from your tests using the token of the logged user (for example to [set up the state bypassing the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI)) you can get the retrieved user tokes from the kcLogin command:

```typescript
describe("Keycloak Login", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("user").as("tokens");
    cy.visit("/");
  });

  it("should call an API with the token", () => {
    cy.get("@tokens").then(tokens => {
      cy.request({
        url: "/my_api"
        auth: {
          bearer: tokens.access_token
        }
      });
    });
  });
});
```

Note: if you use Typescript you have to specify the return type of the `cy.get` command:

```typescript
cy.get<KcTokens>("@tokens");
```

### Fake Login for Integration testing

If you are doing an integration test that doesn't call a real backend API, maybe you don't need to authenticate a real user to a running Keycloak instance, but if your app uses the Keycloak Javascript Adapter to check if a user is logged in, you will need to have a mocked user.

To create mocked user data, you need three tokens (access token, refresh token, id token) of a real user returned by your Keycloak instance. You can get them for example from the Dev Tools of your browser, searching for calls to the `token` endpoint of Keycloak. If your app calls the `/account` endpoint to retrieve user information you will also need to have the response returned for the API. Then you can create the fixture with the fake user data:

```json
{
  "fakeLogin": {
    "access_token": "...",
    "refresh_token": "...",
    "id_token": "...",
    "account": {
      "username": "user",
      "firstName": "Sample",
      "lastName": "User",
      "email": "sample-user@example",
      "emailVerified": false,
      "attributes": {}
    }
  }
}
```

With the fixture in place, you can use the `kcFakeLogin` command to perform a fake login without hitting a real Keycloak instance.

The Fake Login is performed loading a page and passing some keycloak initialization parameters in the URL. If you need to visit a page different from the homepage you must pass its url to the `kcFakeLogin` command as second parameter (instead of using `cy.visit`):

```typescript
describe("Keycloak Fake Login", () => {
  beforeEach(() => {
    cy.kcFakeLogin("user", "pageToVisit");
  });
});
```

#### Session Status iframe

At the moment within Cypress is not possible to mock iframe loading and APIs called from an iframe. For this reason, when you use `kcFakeLogin` you have to disable the Session Status iframe, otherwise the Javascript adapter will redirect you to the real Keyacloak instance. You can disable it only when the app is running inside Cypress:

```typescript
const checkLoginIframe = window.Cypress ? false : true;

var initOptions = {
  responseMode: "fragment",
  flow: "standard",
  onLoad: "login-required",
  checkLoginIframe
};
```

## Acknowledgements

Other solutions that have inspired this library:

- https://vrockai.github.io/blog/2017/10/28/cypress-keycloak-intregration/
- https://www.npmjs.com/package/cypress-keycloak

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Fredx87"><img src="https://avatars2.githubusercontent.com/u/13420283?v=4" width="100px;" alt=""/><br /><sub><b>Gianluca Frediani</b></sub></a><br /><a href="#infra-Fredx87" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#tool-Fredx87" title="Tools">🔧</a> <a href="https://github.com/Fredx87/cypress-keycloak-commands/commits?author=Fredx87" title="Tests">⚠️</a> <a href="https://github.com/Fredx87/cypress-keycloak-commands/commits?author=Fredx87" title="Documentation">📖</a> <a href="#ideas-Fredx87" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/Fredx87/cypress-keycloak-commands/commits?author=Fredx87" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/groie"><img src="https://avatars3.githubusercontent.com/u/5516998?v=4" width="100px;" alt=""/><br /><sub><b>Ilkka Harmanen</b></sub></a><br /><a href="https://github.com/Fredx87/cypress-keycloak-commands/commits?author=groie" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!