# Résumé direction

This note is a decision guide for the cookbook app and a short list of later projects. The recipe finder belongs in this app. A full document RAG system and an MCP server stay separate projects.

## Decision

Put the chatbot in the cookbook. It is a way to find recipes that fit what someone feels like eating.

Someone types a plain request, such as "a Mediterranean dish" or "something with chicken that is not spicy." The app looks through recipes already saved here and returns the ones that fit, with a short reason. For Mediterranean food, that reason is shared ingredients and patterns: olive oil, lemon, tomato, garlic, herbs like oregano, yogurt, chickpeas. The reply is a set of recipe cards from this database, not a new recipe the model wrote.

Today, browse search checks the exact words in the title, description, and ingredient names. A search for "Mediterranean" misses a lemon-herb chicken that never uses that word, even when the ingredient list is olive oil, lemon, and oregano. The chatbot's job is to turn the request into those signals, then match them to recipes you already store.

### How the finder should work

1. The person sends one message.
2. The model returns structured search intent: ingredient keywords, foods to avoid, and rough traits such as "weeknight" or "Mediterranean."
3. The server queries MongoDB for recipes whose titles or ingredient names overlap those keywords.
4. Rank by how many signals overlap.
5. The model writes one sentence per match, using only that recipe's real ingredients. Example: "Fits a Mediterranean request because it uses olive oil, oregano, and lemon."
6. If nothing overlaps, say so and show the closest recipes, or say the collection does not have a match yet.

Show recipe cards under the message. Each card links to the real recipe page.

Stay with keyword overlap first. Recipes are short and already split into ingredient names, so you do not need a vector database to make "Mediterranean" useful. Add embeddings later only if requests like "something cozy" or "light summer dinner" keep missing good recipes that a person would have picked.

The finder must not invent a dish that is not in the database. If the collection has no olive-oil recipes, the honest answer is that nothing stored here fits yet.

MCP stays a separate project. MCP is how an AI client such as Cursor calls tools you expose. The person looking for dinner uses the cookbook site, not that protocol.

### What to finish here first

These items are already on the task list. Ship them before the finder so the demo has real recipes, a stable browse page, and nutrition on the card the finder returns.

- Reorganize the profile page
- LLM provider selector (Ollama vs OpenAI) as a finished control
- Nutrition data on a recipe
- Liked cookbooks show the author's name
- Pagination that stays readable as the window changes size

### What this adds to the cookbook résumé bullet

After the finder ships, you can describe two AI jobs in one product:

- A photo or PDF becomes a structured recipe (OCR plus a model).
- A plain-language craving becomes a ranked list of saved recipes, with the matching ingredients called out.

## What this project already proves

Use this when you talk about the cookbook. The finder is recipe matching inside the product. A document RAG system and an MCP server are the separate projects below.

- React, TypeScript, Vite, Tailwind, React Query
- Express, TypeScript, MongoDB, Mongoose
- JWT auth and private cookbooks
- Create, read, update, and delete for recipes and cookbooks
- Community browsing and pagination
- OCR plus an LLM that returns structured JSON, with a local model (Ollama) and a hosted model (OpenAI)

Sample bullet:

> Built a full-stack recipe app where a person uploads a photo or PDF and receives a structured recipe. OCR extracts the text and an LLM (Ollama or OpenAI) parses it into title, ingredients, and steps, stored in MongoDB behind JWT auth.

## How to choose the next project

Pick **two** projects from the list below. The cookbook finder already covers matching saved recipes to a craving. The gap left is long-document retrieval (quote a page) and tools an outside AI client can call.

Each project needs:

- A person with a job to do, in one sentence
- A README with a screenshot or a short demo recording
- One measurable check (a small set of questions with expected sources, or a schema the tool output must match)
- A boundary: what the system refuses to invent when it does not have the data

Ship the small version before adding a second model, a second database, or a mobile app.

---

## Future projects

The recipe finder described above is part of this app, so it is not repeated here as its own project.

### 1. Cookbook MCP server

**A person using Cursor or Claude Desktop asks "what is in my chili recipe?" and the client calls your server instead of guessing.**

What you build:

- An MCP server with a few tools: `search_recipes`, `get_recipe`, `list_cookbooks`
- Clear input schemas (a query string, a recipe id)
- Auth so the tools only return that person's recipes
- A README that shows the client config and one real tool call

Skills this adds: MCP, tool design, JSON schemas, auth on a non-HTTP-page client.

Why its own repo: MCP is infrastructure for AI clients. The cookbook UI never needs to mention it. A reviewer can clone this repo and connect it in a few minutes.

You can point the tools at the cookbook API once that API is stable, or at a small JSON fixture so the MCP project runs alone.

Sample bullet:

> Published an MCP server that lets an AI client search and read a user's recipes through typed tools, with auth so each call stays inside that user's data.

### 2. Document Q&A with an eval set

**A person uploads a few PDFs (a syllabus, a lease, a manual) and asks questions. Every answer quotes the page it came from. You can show that it was right on a list of questions you wrote ahead of time.**

This is the RAG project. The cookbook finder matches short ingredient lists. This one answers from long documents and has to point at a page. Build it when you want a retrieval bullet that is separate from the recipe app.

What you build:

- PDF text extraction and chunking by page or section
- Hybrid search if you have time (keywords plus embeddings)
- Answers that include a quote and a page number
- A spreadsheet or JSON file of questions, expected pages, and a pass/fail you can re-run

Skills this adds: document ingestion, citations, hybrid retrieval, evaluation as a habit.

Sample bullet:

> Built a document question-answering app that quotes a page for every answer and re-runs a fixed question set to check that the cited page is correct.

### 3. Meal-planning agent

**A person says "plan five dinners, no dairy, using what I already have" and the agent calls tools until it has a plan.**

What you build:

- Tools with strict outputs: `search_recipes`, `check_ingredient`, `save_plan`
- A loop that must call a tool before it claims a recipe exists
- A saved plan the person can open later
- A refusal when no saved recipe fits the constraint, instead of inventing one

Skills this adds: tool-calling agents, constraint handling, multi-step tasks.

Why its own repo: an agent loop is a different architecture from a single OCR request. Give it a small recipe fixture so the demo does not depend on the cookbook being deployed.

Sample bullet:

> Built a meal-planning agent that searches a recipe catalog through tools and returns a week of dinners that match dietary constraints, saving the plan for the user.

### 4. OCR quality harness for this cookbook

**You upload the same set of recipe photos twice and can say how often the title, ingredients, and steps came back complete.**

This one is allowed to live next to the cookbook, as a script and a fixture folder, because it measures the feature you already shipped. It is still worth listing on a résumé as its own bullet.

What you build:

- 10–20 real recipe images or text files you have the right to use
- Expected JSON for each one (title, ingredient count, first step)
- A script that runs the existing parse path and prints a score
- Notes on failures (handwriting, two-column cards, missing units)

Skills this adds: evaluation, regression checks, honest limits of OCR plus LLM parsing.

Sample bullet:

> Added a fixture set and a scoring script for an OCR-to-recipe pipeline, measuring how often parsed titles, ingredients, and steps match a known-good JSON file.

### 5. Local-only notes assistant

**A person keeps notes on their own machine. They ask a question and get an answer from those notes, with no API key and no data leaving the laptop.**

What you build:

- Ollama for both the chat model and the embedding model
- A local vector store on disk
- A note folder they can drop markdown into
- A short privacy note in the README: what stays on disk

Skills this adds: local models, offline embeddings, privacy as a product choice.

You already call Ollama for recipe parsing. This project shows you can run the retrieval stack locally too.

Sample bullet:

> Built an offline notes assistant using a local chat model and local embeddings, so questions are answered from the user's files without sending them to a hosted API.

---

## Golfmates: where extra AI actually helps

The app to improve is the original pair: the web frontend in `golfmates` and the API in `golfmates-backend`. The React Native copies are separate and are not the base for this decision.

On the course, a person taps to mark a shot. Each hole is a list of coordinates. The map already draws those points, shows yards between them, and the scorecard counts strokes from how many marks are on the hole. When the round is done, they add a description and post the course, the coordinates, and every hole to `golfmates-backend`. Friends, chat, and the activity feed sit around that saved game.

A language model does not improve the moment of marking a shot. Yardage is the distance between two coordinates, and that math is already in the app. Phone GPS is also rough, often several yards off, so a model should not claim it saw a slice from two dots.

Saved games are enough to summarize a round without a new capture flow. From the hole coordinates already in MongoDB you can state shots per hole and yards per stroke. What you cannot say yet is "your 7-iron," because a shot is only a coordinate. There is no club on it.

### Make the older app better before adding a model

- Save a club with each shot (7-iron, driver, putter), on the play screen and in the game stored by `golfmates-backend`.
- Keep showing yards the way the map and hole-distance list already do. Add yards from where they stand to the last mark on the hole, while they are still playing.
- After a few posted rounds, show plain stats: shots per hole, yards per stroke, and, once clubs exist, average yards by club. How far a shot finishes from the last mark on the hole is the stand-in for distance to the hole.

Left and right misses can be computed from the first point, the last point, and the shots in between. That is geometry on data you already store. It becomes a club tendency only after the same club shows up across several rounds.

### The one AI feature worth adding

A short recap after the round, written from those stats.

Example, only after the numbers exist: "Your 7-iron averaged 148 yards over 4 rounds. Approach shots finished about 12 yards short of the hole."

The model turns the calculated stats into a sentence. It does not invent the yards. If there are fewer than a handful of shots with that club, the recap says there is not enough history yet.

A live caddie ("you're 152 out, hit 7-iron") is the same feature, one step later: look up that person's average for each club and pick the closest. It is a lookup on their data. It is worth building only after club yardages are real.

### What to leave off Golfmates

- A chat box for golf tips. It does not use their marked shots.
- RAG over rules or instruction articles. Same gap: their coordinates never enter the answer.
- MCP. Nobody on the course is connecting an AI client.
- Swing video analysis. The app does not record a swing, and that is a different product.

### Which app should get the AI work

| Job | Better home | Why |
| --- | --- | --- |
| Turn a photo of a recipe into structured fields | Cookbook | The input is messy language and layout. A model is good at that. |
| "Mediterranean" finds recipes with olive oil, lemon, oregano | Cookbook | The request is language. The match is ingredient overlap in data you store. |
| Yards of a shot, yards to the hole, average by club | Golfmates | The input is coordinates. The answer is arithmetic. |
| Round recap in a sentence | Golfmates, after the stats exist | The model only phrases numbers you already computed. |
| Quote a page from a PDF, or expose tools to Cursor | A new project | Those demos need their own README. They are not a round of golf or a saved recipe. |

---

## Suggested order

1. Finish the cookbook task list, including nutrition on a recipe.
2. Add the recipe finder in this app: one message in, matching recipe cards out, with the overlapping ingredients named.
3. Add the OCR quality harness (project 4) so the photo-to-recipe feature has a number attached to it.
4. Build document Q&A (project 2) when you want a RAG bullet about long documents and page citations.
5. Build the cookbook MCP server (project 1) when you want a bullet about tools an AI client can call.

Skip the meal-planning agent and the local notes assistant until the finder is demoable and you have either document Q&A or the MCP server.

## One-line answers for interviews

- **What does the chatbot do?** It turns a craving into ingredient and style signals, then returns saved recipes that overlap those signals. "Mediterranean" can match olive oil, lemon, and oregano even when the recipe title never says Mediterranean.
- **Where does a full RAG project go?** In a separate document app, where the answer has to quote a page from a PDF. The cookbook finder is matching short recipes you already store.
- **What is MCP doing here?** It is its own server. An AI client calls recipe tools. The cooking UI stays a normal web app.
- **Why isn't the golf app the AI project?** Marked shots are coordinates. The useful upgrade is club, yardage, and a recap written from those numbers. Language features stay on the cookbook.
