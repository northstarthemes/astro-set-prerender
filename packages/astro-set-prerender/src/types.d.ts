export type IntegrationOptions =
	| {
			/** Routes that should be static rendered. All other routes will be server rendered by default. */
			staticRender?: RegExp[]
	  }
	| {
			/** Routes that should be server rendered. All other routes will be static rendered by default. */
			serverRender?: RegExp[]
	  }
