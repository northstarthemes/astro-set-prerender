import { defineConfig } from 'tsdown'

const config: unknown = defineConfig({
	entry: {
		index: 'src/index.ts',
	},
	format: ['esm'],
	clean: true,
	dts: true,
})

export default config
