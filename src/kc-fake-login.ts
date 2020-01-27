import { createUUID, decodeToken } from "./utils";

Cypress.Commands.add("kcFakeLogin", (user: string) => {
	Cypress.log({ name: "Fake Login" });

	return cy.fixture(`users/${user}`).then((userData: UserData) => {
		if (!userData.fakeLogin) {
			throw new Error(
				"To use kcFakeLogin command you should define fakeLogin data in fixture"
			);
		}

		const authBaseUrl = Cypress.env("auth_base_url");
		const realm = Cypress.env("auth_realm");
		const {
			account,
			access_token,
			refresh_token,
			id_token
		} = userData.fakeLogin;

		const state = createUUID();
		const { nonce } = decodeToken(access_token);

		const token = {
			access_token,
			expires_in: 300,
			refresh_expires_in: 1800,
			refresh_token,
			token_type: "bearer",
			id_token,
			"not-before-policy": 0,
			session_state: createUUID(),
			scope: "openid"
		};

		const localStorageObj = {
			state,
			nonce,
			expires: Date() + 3600
		};

		const localStorageKey = `kc-callback-${state}`;

		window.localStorage.setItem(
			localStorageKey,
			JSON.stringify(localStorageObj)
		);

		cy.server();

		cy.route(
			"post",
			`${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
			token
		);

		cy.route(`${authBaseUrl}/realms/${realm}/account`, account);

		const url = `${
			Cypress.config().baseUrl
		}/#state=${state}&session_state=${createUUID()}&code=${createUUID()}`;

		cy.visit(url);
	});
});
