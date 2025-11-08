exports[`text (e2e) > should work with \`--import\` 1`] = `
"query GetFoo($a: A!, $b: B!) {\\n\\tfoo (a: $a, b: $b) {\\n\\t\\tid\\n\\t\\tbar {\\n\\t\\t\\tsize\\n\\t\\t}\\n\\t}\\n}\\n\\n"
`;

exports[`text (e2e) > should work with \`--loader\` 1`] = `
"query GetFoo($a: A!, $b: B!) {\\n\\tfoo (a: $a, b: $b) {\\n\\t\\tid\\n\\t\\tbar {\\n\\t\\t\\tsize\\n\\t\\t}\\n\\t}\\n}\\n\\n"
`;

exports[`text (e2e) > should work with \`module.registerHooks\` 1`] = `
"query GetFoo($a: A!, $b: B!) {\\n\\tfoo (a: $a, b: $b) {\\n\\t\\tid\\n\\t\\tbar {\\n\\t\\t\\tsize\\n\\t\\t}\\n\\t}\\n}\\n\\n"
`;

exports[`text (e2e) > should work with \`module.register\` 1`] = `
"query GetFoo($a: A!, $b: B!) {\\n\\tfoo (a: $a, b: $b) {\\n\\t\\tid\\n\\t\\tbar {\\n\\t\\t\\tsize\\n\\t\\t}\\n\\t}\\n}\\n\\n"
`;
