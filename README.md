# AstroJS Prerender Plugin

A plugin by [North Star Themes](https://northstarthemes.com/) that gives you control over which routes should be static rendered (prerendered) and which should be server rendered in your Astro application.

## Installation

```bash
npm install @northstarthemes/astro-set-prerender
```

## Usage

Add the plugin to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import setPrerender from '@northstarthemes/astro-set-prerender'

export default defineConfig({
	integrations: [
		setPrerender({
			// Configuration options here
		}),
	],
})
```

## Configuration

The plugin accepts the following configuration options:

```js
setPrerender({
	// Array of route patterns that should be prerendered
	prerenderRoutes: [/^blog/, /^about/],

	// Array of route patterns that should be server rendered
	serverRoutes: [/^api/, /^dynamic/],
})
```

Only one of the two configuration options can be defined. If `prerenderRoutes` is defined, then all other routes are server rendered by default. If `serverRoutes` is defined then all other routes are static rendered by default.

## Features

- Support for regex patterns in route definitions
- Easy integration with existing Astro projects

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please visit [North Star Themes](https://northstarthemes.com/) or open an issue on GitHub.
