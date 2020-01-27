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

// eslint-disable-next-line no-unused-vars
declare namespace Cypress {
	interface Chainable {
		kcLogin(user: string): Chainable<string>;
		kcLogout(): Chainable<void>;
		kcFakeLogin(user: string): Chainable<void>;
	}
}
