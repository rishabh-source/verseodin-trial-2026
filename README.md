# Verseodin Trial

## Setup

The setup is mostly handled by the provided scaffold. If you are starting fresh:

1. `nvm use`
2. `npm install`
3. `npm run seed` (Generates the seed data)
4. `npm run dev`

No additional environment variables or external databases are required for this trial.

## What I built

**Feature 1: AI Traffic Dashboard (`/traffic`)**
For the traffic dashboard, I built a highly performant stacked bar chart using Recharts to visualize AI bot traffic. The core innovation is the aggregation strategy: 100,000 raw visits are aggregated in a single O(n) pass on load. This process builds a daily matrix and the top pages/crawlers lists simultaneously. Furthermore, legend toggles are handled in O(1) time by leveraging React state and `<Bar hide={true}>` rather than re-filtering the raw dataset. A unified configuration (`bot-config.ts`) seamlessly provides colors and parent companies.
*What's working*: The initial O(n) aggregation process, the rendering of the chart, and the instantaneous toggling of bot categories.
*What's not working*: The chart layout can feel cramped on extremely narrow mobile viewports due to the density of the 90-day axis. 

**Feature 2: Action Centre (`/actions`)**
I implemented an extensible triage queue driven by a pure derivation function (`deriveActions`). It uses a Handler Registry pattern, ensuring that adding a new event type simply requires appending a new handler rather than extending a massive switch statement. Actions are assigned deterministic IDs by hashing their sorted source event IDs, ensuring that re-running derivation yields the exact same IDs for the same underlying events.
*What's working*: Grouping of Reddit mentions, articles, missed citations, and competitor dominance into actionable cards. Composable filtering works flawlessly across both Active and Dismissed tabs, and state is reliably persisted and hydrated from `localStorage` without UI flashing.
*What's not working*: Sorting by date or custom severity is not yet implemented. There is also no pagination, meaning a massive influx of events could theoretically cause a long, un-virtualized DOM list.

## What I cut and why

- **Date-range filtering on `/traffic`**: Cut to maintain the strict performance budget. Supporting dynamic date ranges efficiently while keeping O(1) toggles would require storing the raw 100K rows in state or aggressively re-aggregating on every date change. For this timeframe, locking to a 90-day view allowed me to prioritize the initial aggregation and rendering performance.
- **Virtualized scrolling in `/actions`**: Cut to save time. While the derivation function handles the current dataset well, rendering hundreds of complex React cards simultaneously could be a bottleneck. I prioritized the core derivation logic and handler registry over UI virtualization.
- **Complex animations & Toast notifications**: Cut to avoid unnecessary complexity. While animations would have made the dashboard feel more premium, the priority was data correctness, stable identifiers, and core functional requirements.

## AI tool usage

For this project, I used an advanced agentic coding assistant (similar to Cursor with Claude 3.5 Sonnet / Gemini). 

- **Where it helped**: The AI was exceptional at scaffolding the initial React component boilerplate, aligning the UI with Tailwind CSS tokens, and generating the Recharts boilerplate. It also significantly accelerated the implementation of the `localStorage` hydration logic and standard React hooks.
- **Where I rewrote output**: The AI initially suggested filtering the 100k rows directly inside a `useMemo` on every render for the Traffic Dashboard. I completely rewrote this into the O(n) upfront aggregation strategy and O(1) legend toggling, as the AI's naive approach would have caused massive performance drops.
- **Reviewed vs. Trusted**: I trusted the AI for CSS utilities, visual design alignments, and standard React boilerplate. However, I reviewed the core derivation logic (`deriveActions`) and the deterministic hashing strategy line-by-line. The AI occasionally struggled to understand that hashing multiple *sorted* event IDs was strictly necessary for idempotency, so I had to explicitly enforce and review that logic to ensure there were no hash collisions or duplicate actions.

## What I'd do in week 2

- **Web Workers for Aggregation**: Move the initial 100K row aggregation for the `/traffic` route into a Web Worker. This would keep the main thread entirely unblocked during the first render, improving Time to Interactive (TTI).
- **Virtualization**: Implement virtualized scrolling (e.g., `@tanstack/react-virtual`) for the Action Centre card grid to support infinitely scaling triage queues without DOM bloat.
- **Real Backend Integration**: Replace the seeded JSON files with proper API routes (e.g., PostgreSQL + Prisma), shifting the heavy lifting of aggregation, filtering, and pagination to the server.
- **Undo Functionality**: Add a temporary inline undo link or toast for actions recently moved to the Dismissed tab.
