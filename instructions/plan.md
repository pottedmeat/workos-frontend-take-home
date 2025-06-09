# Layout

- Semantically meaningful DOM

# Tech

- TanStack Query w/ fetchers and queryOptions

# Loading

- Use a single row skeleton
- Always set aside space for 10 rows to avoid jumping around
- Preload next page
- Potentially use the infinite search
- Roles need to be loaded to display the role name for a user
  - Pre-load role with users and fall back to loading by ID if not in first n pages (API returns number of pages)

# Search

- Separate user/role tables one per tab
- Separate list/search tables within each tab
- Use debouncing
- When no results are present, run a text search on current results

# Improvements

- Have the API return what page it's on, make the input a dropdown, and instead highlight the user on the loaded page
- 