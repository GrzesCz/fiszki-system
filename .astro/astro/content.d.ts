declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"notatki": {
"01_pathlib.md": {
	id: "01_pathlib.md";
  slug: "01_pathlib";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"02_typing.md": {
	id: "02_typing.md";
  slug: "02_typing";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"03_dotenv.md": {
	id: "03_dotenv.md";
  slug: "03_dotenv";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"04_uuid.md": {
	id: "04_uuid.md";
  slug: "04_uuid";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"05_pydantic_settings.md": {
	id: "05_pydantic_settings.md";
  slug: "05_pydantic_settings";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"06_logging.md": {
	id: "06_logging.md";
  slug: "06_logging";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"07_structlog.md": {
	id: "07_structlog.md";
  slug: "07_structlog";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"08_pydantic_v2.md": {
	id: "08_pydantic_v2.md";
  slug: "08_pydantic_v2";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"09_sqlalchemy_2.md": {
	id: "09_sqlalchemy_2.md";
  slug: "09_sqlalchemy_2";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"10_alembic.md": {
	id: "10_alembic.md";
  slug: "10_alembic";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"11_async_await.md": {
	id: "11_async_await.md";
  slug: "11_async_await";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"12_fastapi.md": {
	id: "12_fastapi.md";
  slug: "12_fastapi";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"13_uvicorn.md": {
	id: "13_uvicorn.md";
  slug: "13_uvicorn";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"15_fastmcp.md": {
	id: "15_fastmcp.md";
  slug: "15_fastmcp";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"16_pypika.md": {
	id: "16_pypika.md";
  slug: "16_pypika";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"17_langchain.md": {
	id: "17_langchain.md";
  slug: "17_langchain";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"AGENTS.md": {
	id: "AGENTS.md";
  slug: "agents";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"docs-explain-concept.md": {
	id: "docs-explain-concept.md";
  slug: "docs-explain-concept";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"docs-quiz-me.md": {
	id: "docs-quiz-me.md";
  slug: "docs-quiz-me";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-abc-mock-fixture-polaczenie.md": {
	id: "pytest-abc-mock-fixture-polaczenie.md";
  slug: "pytest-abc-mock-fixture-polaczenie";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-kompendium_technik_pytest.md": {
	id: "pytest-kompendium_technik_pytest.md";
  slug: "pytest-kompendium_technik_pytest";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-notatki copy.md": {
	id: "pytest-notatki copy.md";
  slug: "pytest-notatki-copy";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-notatki.md": {
	id: "pytest-notatki.md";
  slug: "pytest-notatki";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-progres_nauki.md": {
	id: "pytest-progres_nauki.md";
  slug: "pytest-progres_nauki";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-studium_przypadku_imprv.md": {
	id: "pytest-studium_przypadku_imprv.md";
  slug: "pytest-studium_przypadku_imprv";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"pytest-zadania.md": {
	id: "pytest-zadania.md";
  slug: "pytest-zadania";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"struktura-projektow-analiza_imprv.md": {
	id: "struktura-projektow-analiza_imprv.md";
  slug: "struktura-projektow-analiza_imprv";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
"struktura-projektow-notatki.md": {
	id: "struktura-projektow-notatki.md";
  slug: "struktura-projektow-notatki";
  body: string;
  collection: "notatki";
  data: InferEntrySchema<"notatki">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"fiszki": {
"flyer-engine-bootstrap": {
	id: "flyer-engine-bootstrap";
  collection: "fiszki";
  data: InferEntrySchema<"fiszki">
};
"flyer-engine-config": {
	id: "flyer-engine-config";
  collection: "fiszki";
  data: InferEntrySchema<"fiszki">
};
"pytest-fixtures-struktura": {
	id: "pytest-fixtures-struktura";
  collection: "fiszki";
  data: InferEntrySchema<"fiszki">
};
"pytest-fundamenty": {
	id: "pytest-fundamenty";
  collection: "fiszki";
  data: InferEntrySchema<"fiszki">
};
"pytest-techniki": {
	id: "pytest-techniki";
  collection: "fiszki";
  data: InferEntrySchema<"fiszki">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
