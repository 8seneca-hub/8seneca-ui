import assert from "node:assert/strict";
import { test } from "node:test";
import { APPS, isCurrent, resolveApps } from "../dist/index.js";

test("registry lists the three apps in order", () => {
  assert.deepEqual(
    APPS.map((a) => a.id),
    ["hrm", "plane"],
  );
  for (const app of APPS) {
    assert.match(app.url, /^https:\/\//, `${app.id} url must be absolute`);
    assert.ok(app.name.length > 0);
    assert.ok(typeof app.icon === "function" || typeof app.icon === "object");
  }
});

test("resolveApps without overrides returns the registry unchanged", () => {
  assert.deepEqual(resolveApps(), APPS);
  assert.deepEqual(resolveApps({}), APPS);
});

test("resolveApps replaces only the overridden url and keeps order", () => {
  const tiles = resolveApps({ plane: "http://localhost:8000" });
  assert.deepEqual(tiles.map((t) => t.id), ["hrm", "plane"]);
  assert.equal(tiles[1].url, "http://localhost:8000");
  assert.equal(tiles[0].url, APPS[0].url);
  assert.equal(tiles[1].name, "8Projects");
});

test("resolveApps ignores unknown ids and empty values", () => {
  assert.deepEqual(resolveApps({ nope: "http://x" }), APPS);
  assert.deepEqual(resolveApps({ hrm: "" }), APPS);
});

test("isCurrent matches the exact hostname only", () => {
  const hrm = APPS[0];
  assert.equal(isCurrent(hrm, "people.8seneca.com"), true);
  assert.equal(isCurrent(hrm, "8seneca.com"), false);
  assert.equal(isCurrent(hrm, "evil-people.8seneca.com"), false);
  assert.equal(isCurrent(hrm, "localhost"), false);
  assert.equal(isCurrent(hrm, ""), false);
});

test("isCurrent ignores port and path", () => {
  const tile = { id: "hrm", name: "8People", url: "http://localhost:3000/dashboard", icon: () => null, color: "red" };
  assert.equal(isCurrent(tile, "localhost"), true);
});
