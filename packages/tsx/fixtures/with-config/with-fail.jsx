import assert from "node:assert/strict";
import { test } from "node:test";

const Foo = () => <span>foo</span>;

test("jsx", () => {
	assert.strictEqual(
		<Foo />,
		{}
	)
});
