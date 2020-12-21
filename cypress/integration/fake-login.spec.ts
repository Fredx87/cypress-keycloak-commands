/// <reference types="cypress" />
/// <reference types="../../" />

describe("Keycloak Fake Login", () => {
  it("should show user as authenticated", () => {
    cy.kcFakeLogin("user");
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should get user data equal to fixture data", () => {
    cy.kcFakeLogin("user");
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.findByText("Get Profile").click();

    cy.fixture("users/user.json").then((userData: UserData) => {
      cy.get("#output").should(el => {
        const value = JSON.parse(el.text());
        expect(value).to.deep.equal(userData.fakeLogin?.account);
      });
    });
  });

  it("should go to the specified path with hash and show user as authenticated", () => {
    cy.kcFakeLogin("user", "#/foobar");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/#/foobar`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should go to the specified path without hash and show user as authenticated", () => {
    cy.kcFakeLogin("user", "index.html");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });
});

describe("Keycloak Fake Login with runtime credentials", () => {
  it("should show user as authenticated", () => {
    cy.kcFakeLogin({
      fakeLogin: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiJhZTZhMmQ4Zi1lNTZiLTQ4MWQtOThhMS1hNzU5NzMzNDg1ZGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqcy1jb25zb2xlIiwibm9uY2UiOiJiZjJmODA2OS0yYTNmLTQzY2EtOWI2Yy1kOTk2NzE4MDZmNTYiLCJhdXRoX3RpbWUiOjE1ODAxMjU5MjEsInNlc3Npb25fc3RhdGUiOiI2N2U2YWZjNS03OTE3LTQ3MjAtYmViNy0xYWM1ZDFmNDlkOTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.Cb_WD_L2XyWUCt9h6QUs6aTxbGbOod9zbE2hfeNVMzGhKc2t22CgvaiUbhs1YmETGxGd7_ABR3G-Z99pmJQYDydEo4AdLfqztssJOr53mAgal_J64JIs0sl0e26sE3Cdd6K0ZS0W3eHHNmlGxOFL5erphWN53BZ-HX9JG0I3K1c",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmZGIyYmYyYS1jMDI1LTRmODEtYWZmMi1hYTJlY2FjNzg1MTYifQ.eyJqdGkiOiJjYWE0YTllYi04NGZhLTRhMTMtYjZjZS0yMjM4ZmVlYzYyM2UiLCJleHAiOjE1ODAxMjc3MjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9hdXRoL3JlYWxtcy9leGFtcGxlIiwic3ViIjoiNjdjMzMxMzQtYWFhMS00ZDg4LWE3Y2UtMzU0MDhkMGYxMzMyIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSJ9.6BVpoZCsZbb6vPpdFwspAFT8lYCLYyNrcrOU-27VMaY",
        id_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiIzNjMxZTZlNi03MTQ1LTQyZWUtOWU2Yi01MDFkNDFhZGI1NGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImpzLWNvbnNvbGUiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJJRCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MTU4MDEyNTkyMSwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.pDHa-ioVBiHNRHiu0atnKTNHn2d_NPMFYBoiQXTuZ4Wj0jfwUqsOD1KIC1t5Q1-OBNLjnzBRhm8qfvg3Vm-B7mNchIJkGOJlF8XcN7e1VyXOWb2yNvZ4TL5QtF_5aVx-_WgpajiUdQyKVEWtwMbb1qyKMVHH2vIxtzep9Sy2zek",
        account: {
          username: "user",
          firstName: "Sample",
          lastName: "User",
          email: "sample-user@example",
          emailVerified: false,
          attributes: {}
        }
      }
    });
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should get user data equal to fixture data", () => {
    cy.kcFakeLogin({
      fakeLogin: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiJhZTZhMmQ4Zi1lNTZiLTQ4MWQtOThhMS1hNzU5NzMzNDg1ZGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqcy1jb25zb2xlIiwibm9uY2UiOiJiZjJmODA2OS0yYTNmLTQzY2EtOWI2Yy1kOTk2NzE4MDZmNTYiLCJhdXRoX3RpbWUiOjE1ODAxMjU5MjEsInNlc3Npb25fc3RhdGUiOiI2N2U2YWZjNS03OTE3LTQ3MjAtYmViNy0xYWM1ZDFmNDlkOTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.Cb_WD_L2XyWUCt9h6QUs6aTxbGbOod9zbE2hfeNVMzGhKc2t22CgvaiUbhs1YmETGxGd7_ABR3G-Z99pmJQYDydEo4AdLfqztssJOr53mAgal_J64JIs0sl0e26sE3Cdd6K0ZS0W3eHHNmlGxOFL5erphWN53BZ-HX9JG0I3K1c",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmZGIyYmYyYS1jMDI1LTRmODEtYWZmMi1hYTJlY2FjNzg1MTYifQ.eyJqdGkiOiJjYWE0YTllYi04NGZhLTRhMTMtYjZjZS0yMjM4ZmVlYzYyM2UiLCJleHAiOjE1ODAxMjc3MjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9hdXRoL3JlYWxtcy9leGFtcGxlIiwic3ViIjoiNjdjMzMxMzQtYWFhMS00ZDg4LWE3Y2UtMzU0MDhkMGYxMzMyIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSJ9.6BVpoZCsZbb6vPpdFwspAFT8lYCLYyNrcrOU-27VMaY",
        id_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiIzNjMxZTZlNi03MTQ1LTQyZWUtOWU2Yi01MDFkNDFhZGI1NGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImpzLWNvbnNvbGUiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJJRCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MTU4MDEyNTkyMSwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.pDHa-ioVBiHNRHiu0atnKTNHn2d_NPMFYBoiQXTuZ4Wj0jfwUqsOD1KIC1t5Q1-OBNLjnzBRhm8qfvg3Vm-B7mNchIJkGOJlF8XcN7e1VyXOWb2yNvZ4TL5QtF_5aVx-_WgpajiUdQyKVEWtwMbb1qyKMVHH2vIxtzep9Sy2zek",
        account: {
          username: "user",
          firstName: "Sample",
          lastName: "User",
          email: "sample-user@example",
          emailVerified: false,
          attributes: {}
        }
      }
    });
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");

    cy.findByText("Get Profile").click();

    cy.fixture("users/user.json").then((userData: UserData) => {
      cy.get("#output").should(el => {
        const value = JSON.parse(el.text());
        expect(value).to.deep.equal(userData.fakeLogin?.account);
      });
    });
  });

  it("should go to the specified path with hash and show user as authenticated", () => {
    cy.kcFakeLogin({
      fakeLogin: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiJhZTZhMmQ4Zi1lNTZiLTQ4MWQtOThhMS1hNzU5NzMzNDg1ZGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqcy1jb25zb2xlIiwibm9uY2UiOiJiZjJmODA2OS0yYTNmLTQzY2EtOWI2Yy1kOTk2NzE4MDZmNTYiLCJhdXRoX3RpbWUiOjE1ODAxMjU5MjEsInNlc3Npb25fc3RhdGUiOiI2N2U2YWZjNS03OTE3LTQ3MjAtYmViNy0xYWM1ZDFmNDlkOTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.Cb_WD_L2XyWUCt9h6QUs6aTxbGbOod9zbE2hfeNVMzGhKc2t22CgvaiUbhs1YmETGxGd7_ABR3G-Z99pmJQYDydEo4AdLfqztssJOr53mAgal_J64JIs0sl0e26sE3Cdd6K0ZS0W3eHHNmlGxOFL5erphWN53BZ-HX9JG0I3K1c",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmZGIyYmYyYS1jMDI1LTRmODEtYWZmMi1hYTJlY2FjNzg1MTYifQ.eyJqdGkiOiJjYWE0YTllYi04NGZhLTRhMTMtYjZjZS0yMjM4ZmVlYzYyM2UiLCJleHAiOjE1ODAxMjc3MjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9hdXRoL3JlYWxtcy9leGFtcGxlIiwic3ViIjoiNjdjMzMxMzQtYWFhMS00ZDg4LWE3Y2UtMzU0MDhkMGYxMzMyIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSJ9.6BVpoZCsZbb6vPpdFwspAFT8lYCLYyNrcrOU-27VMaY",
        id_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiIzNjMxZTZlNi03MTQ1LTQyZWUtOWU2Yi01MDFkNDFhZGI1NGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImpzLWNvbnNvbGUiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJJRCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MTU4MDEyNTkyMSwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.pDHa-ioVBiHNRHiu0atnKTNHn2d_NPMFYBoiQXTuZ4Wj0jfwUqsOD1KIC1t5Q1-OBNLjnzBRhm8qfvg3Vm-B7mNchIJkGOJlF8XcN7e1VyXOWb2yNvZ4TL5QtF_5aVx-_WgpajiUdQyKVEWtwMbb1qyKMVHH2vIxtzep9Sy2zek",
        account: {
          username: "user",
          firstName: "Sample",
          lastName: "User",
          email: "sample-user@example",
          emailVerified: false,
          attributes: {}
        }
      }
    }, "#/foobar");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/#/foobar`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });

  it("should go to the specified path without hash and show user as authenticated", () => {
    cy.kcFakeLogin({
      fakeLogin: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiJhZTZhMmQ4Zi1lNTZiLTQ4MWQtOThhMS1hNzU5NzMzNDg1ZGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJqcy1jb25zb2xlIiwibm9uY2UiOiJiZjJmODA2OS0yYTNmLTQzY2EtOWI2Yy1kOTk2NzE4MDZmNTYiLCJhdXRoX3RpbWUiOjE1ODAxMjU5MjEsInNlc3Npb25fc3RhdGUiOiI2N2U2YWZjNS03OTE3LTQ3MjAtYmViNy0xYWM1ZDFmNDlkOTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.Cb_WD_L2XyWUCt9h6QUs6aTxbGbOod9zbE2hfeNVMzGhKc2t22CgvaiUbhs1YmETGxGd7_ABR3G-Z99pmJQYDydEo4AdLfqztssJOr53mAgal_J64JIs0sl0e26sE3Cdd6K0ZS0W3eHHNmlGxOFL5erphWN53BZ-HX9JG0I3K1c",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmZGIyYmYyYS1jMDI1LTRmODEtYWZmMi1hYTJlY2FjNzg1MTYifQ.eyJqdGkiOiJjYWE0YTllYi04NGZhLTRhMTMtYjZjZS0yMjM4ZmVlYzYyM2UiLCJleHAiOjE1ODAxMjc3MjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9hdXRoL3JlYWxtcy9leGFtcGxlIiwic3ViIjoiNjdjMzMxMzQtYWFhMS00ZDg4LWE3Y2UtMzU0MDhkMGYxMzMyIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSJ9.6BVpoZCsZbb6vPpdFwspAFT8lYCLYyNrcrOU-27VMaY",
        id_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJqdGkiOiIzNjMxZTZlNi03MTQ1LTQyZWUtOWU2Yi01MDFkNDFhZGI1NGYiLCJleHAiOjE1ODAxMjYyMjEsIm5iZiI6MCwiaWF0IjoxNTgwMTI1OTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvYXV0aC9yZWFsbXMvZXhhbXBsZSIsImF1ZCI6ImpzLWNvbnNvbGUiLCJzdWIiOiI2N2MzMzEzNC1hYWExLTRkODgtYTdjZS0zNTQwOGQwZjEzMzIiLCJ0eXAiOiJJRCIsImF6cCI6ImpzLWNvbnNvbGUiLCJub25jZSI6ImJmMmY4MDY5LTJhM2YtNDNjYS05YjZjLWQ5OTY3MTgwNmY1NiIsImF1dGhfdGltZSI6MTU4MDEyNTkyMSwic2Vzc2lvbl9zdGF0ZSI6IjY3ZTZhZmM1LTc5MTctNDcyMC1iZWI3LTFhYzVkMWY0OWQ5NSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJTYW1wbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIiLCJnaXZlbl9uYW1lIjoiU2FtcGxlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJzYW1wbGUtdXNlckBleGFtcGxlIn0.pDHa-ioVBiHNRHiu0atnKTNHn2d_NPMFYBoiQXTuZ4Wj0jfwUqsOD1KIC1t5Q1-OBNLjnzBRhm8qfvg3Vm-B7mNchIJkGOJlF8XcN7e1VyXOWb2yNvZ4TL5QtF_5aVx-_WgpajiUdQyKVEWtwMbb1qyKMVHH2vIxtzep9Sy2zek",
        account: {
          username: "user",
          firstName: "Sample",
          lastName: "User",
          email: "sample-user@example",
          emailVerified: false,
          attributes: {}
        }
      }
    }, "index.html");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/index.html`);
    cy.get("#output").should("contain.text", "Init Success (Authenticated)");
  });
});

