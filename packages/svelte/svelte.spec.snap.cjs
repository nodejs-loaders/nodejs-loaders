exports[`svelte loader > load > should compile svelte files correctly 1`] = `
"import \\"svelte/internal/disclose-version\\";\\nimport \\"svelte/internal/flags/legacy\\";\\nimport * as $ from \\"svelte/internal/client\\";\\n\\nvar root = $.template(\`<h1> </h1>\`);\\n\\nexport default function _unknown_($$anchor, $$props) {\\n\\tlet name = $.prop($$props, \\"name\\", 8);\\n\\tvar h1 = root();\\n\\tvar text = $.child(h1);\\n\\n\\t$.reset(h1);\\n\\t$.template_effect(() => $.set_text(text, \`Hello \${name() ?? \\"\\"}!\`));\\n\\t$.append($$anchor, h1);\\n}"
`;
