/// <reference types="cypress" />

interface UserData {
  username: string;
  password: string;
  fakeLogin?: {
    access_token: string;
    refresh_token: string;
    id_token: string;
    account: object;
  };
}

interface KcTokens {
  access_token: string;
  refresh_token: string;
  id_token: string;
}

// eslint-disable-next-line no-unused-vars
declare namespace Cypress {
  interface Chainable {
    /**
     * Keycloak login with given user credential in fixtures. Optional url, realm, clientID to log into different instance of Keycloak
     * @param user - user fixture
     * @param url - baseUrl for Keycloak
     * @param realms - realm of given Keycloak
     * @param clientId - clientId of given Keycloak
     */
    kcLogin(
      user: string,
      url?: string,
      realms?: string,
      clientId?: string
    ): Chainable<KcTokens>;
    kcLogout(): Chainable<void>;
    kcFakeLogin(user: string, visitUrl?: string): Chainable<void>;
  }
}
