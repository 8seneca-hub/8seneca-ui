import assert from "node:assert/strict";
import { test } from "node:test";
import { APPS, RINGS, isCurrent, resolveApps, ringFor } from "../dist/index.js";

test("registry lists the three apps in order", () => {
  assert.deepEqual(APPS.map((a) => a.id), ["hrm", "plane", "ai"]);
  for (const app of APPS) {
    assert.match(app.url, /^https:\/\//, `${app.id} url must be absolute`);
    assert.ok(app.name.length > 0);
    assert.match(app.logo, /^data:image\/(svg\+xml|png)[;,]/, `${app.id} logo must be inlined`);
  }
});

test("every ring covers every app with an absolute url", () => {
  for (const [ring, urls] of Object.entries(RINGS)) {
    for (const id of ["hrm", "plane", "ai"]) {
      assert.match(urls[id], /^https:\/\//, `${ring}.${id} must be absolute`);
    }
  }
});

test("an unknown or empty host falls back to prod", () => {
  assert.equal(ringFor(""), "prod");
  assert.equal(ringFor("localhost"), "prod");
  assert.equal(ringFor("something-new.8seneca.com"), "prod");
  assert.deepEqual(resolveApps().map((t) => t.url), APPS.map((t) => t.url));
});

test("a sandbox host never links to production", () => {
  for (const host of [
    "hub-plane-sandbox.up.railway.app",
    "hr-systemweb-kc-test.up.railway.app",
    "hr-systemweb-sandbox.up.railway.app",
  ]) {
    assert.notEqual(ringFor(host), "prod", `${host} must not resolve to prod`);
    for (const tile of resolveApps(undefined, host)) {
      assert.ok(
        !tile.url.includes("people.8seneca.com") && !tile.url.includes("projects.8seneca.com"),
        `${host} leaked a production url: ${tile.url}`,
      );
    }
  }
});

test("the sandbox Plane pairs with the keycloak-enabled hrm", () => {
  const tiles = resolveApps(undefined, "hub-plane-sandbox.up.railway.app");
  assert.equal(tiles[0].url, "https://hr-systemweb-kc-test.up.railway.app");
  assert.equal(tiles[1].url, "https://hub-plane-sandbox.up.railway.app");
});

test("each non-prod host marks itself as the current app", () => {
  const cases = [
    ["hub-plane-sandbox.up.railway.app", "plane"],
    ["hr-systemweb-kc-test.up.railway.app", "hrm"],
    ["hr-systemweb-sandbox.up.railway.app", "hrm"],
    ["people.8seneca.com", "hrm"],
    ["projects.8seneca.com", "plane"],
  ];
  for (const [host, expected] of cases) {
    const current = resolveApps(undefined, host).filter((t) => isCurrent(t, host));
    assert.deepEqual(current.map((t) => t.id), [expected], `wrong current app on ${host}`);
  }
});

test("resolveApps replaces only the overridden url and keeps order", () => {
  const tiles = resolveApps({ plane: "http://localhost:8000" });
  assert.deepEqual(tiles.map((t) => t.id), ["hrm", "plane", "ai"]);
  assert.equal(tiles[1].url, "http://localhost:8000");
  assert.equal(tiles[0].url, APPS[0].url);
  assert.equal(tiles[1].name, "8Projects");
});

test("overrides win over the ring, and empty or unknown ids are ignored", () => {
  const host = "hub-plane-sandbox.up.railway.app";
  assert.equal(resolveApps({ hrm: "http://localhost:3000" }, host)[0].url, "http://localhost:3000");
  assert.equal(resolveApps({ hrm: "" }, host)[0].url, "https://hr-systemweb-kc-test.up.railway.app");
  assert.deepEqual(resolveApps({ nope: "http://x" }, host).map((t) => t.id), ["hrm", "plane", "ai"]);
});

test("isCurrent matches the exact hostname only", () => {
  const hrm = APPS[0];
  assert.equal(isCurrent(hrm, "people.8seneca.com"), true);
  assert.equal(isCurrent(hrm, "8seneca.com"), false);
  assert.equal(isCurrent(hrm, "evil-people.8seneca.com"), false);
  assert.equal(isCurrent(hrm, ""), false);
});

test("isCurrent ignores port and path", () => {
  const tile = { id: "hrm", name: "8People", url: "http://localhost:3000/dashboard", icon: () => null, color: "red" };
  assert.equal(isCurrent(tile, "localhost"), true);
});
