# Completed Assignment

- All tasks have been completed
- Client implemented in a simple Vite project
- Styling
  - Components implemented in Radix UI
  - All attempts have been made to be completely faithful to the Figma with the exception of the `...` dropdowns which have excess margins I found difficult to alter.
  - A CSS reset was used (I didn't find a Radix UI version)
- API interaction was implemented with [TanStack Query](https://tanstack.com/query/v5) which conveys the following benefits:
  - Failed calls are retried
  - Mutations (delete user, rename role) are optimistically updated in the UI followed by a page refresh on both success and error, potentially restoring the change if it fails
  - Results are cached and refreshed
- Loading
  - A single-row skeleton is used during loading
  - A minimum of 10 rows is always rendered to prevent page jumping
  - The first page of roles is preloaded to attempt to minimize queries and is reused by the Roles tab
- Accessibility
  - Tab/keyboard usage is well-supported by Radix UI and works as expected in my testing
  - Added aria-label properties where additional context appeared necessary but did not test on a screen reader

## Improvements

- Optimistic UI updates are done through a single mutation object
  - Either block further mutations until processing is complete or alter the underlying cached data
- Errors are exposed in code but not shown to the user
  - A combination of Toast notifications and flags on problem rows would likely be a good approach

# Frontend Take-Home Assignment

Welcome to the WorkOS Frontend Take-Home Assignment!

In this exercise, you'll implement the UI for a simple two-tab layout that lists users and roles. You will also add limited functionality to update users and roles.

You should have recieved an invitation to view a Figma design file for the take-home assignment. If you haven't received and invitation email, please reach out to us.

To get you started, we've also provided a fully functional backend API. Keep in mind, you won’t need to implement all of the functionality implied by the design or backend API. Make sure to focus on the specific tasks outlined below.

Feel free to use any frontend framework and libraries you prefer — there’s no need to build everything from scratch. At WorkOS, we use [Radix Themes](https://www.radix-ui.com/), and it's perfectly fine if you want to leverage similar libraries. Just be ready to explain your decisions, including why you chose certain libraries and how they benefit the project.

If you have any questions, feel free to reach out — we're happy to clarify anything.

## Time Consideration

We value your time! If this assignment takes you more than 8 hours, please submit whatever you have at that point.

Focus on quality. You should be proud of your submission. While the code doesn't need to be 100% production-ready, it should be polished enough for a demo.

Be sure to include a README that outlines what you'd improve or do differently if you had more time.

## Getting Started

1. **Fork the Repo**: Start by forking this repository so that you have your own version to work with.
2. **Start the Backend API**:
   - Ensure you have the latest version of Node.js.
   - Run the following commands to install dependencies and start the API:
     ```bash
     cd server
     npm install
     npm run api
     ```
3. **Project Setup**: Add your project under the `client` directory.

## Design Reference

Be sure to consult the Figma design file that you were invited to view. You'll need to sign-in to Figma to access the design, so you may need to create a Figma account.

The design is a starting point — you'll need to fill in some details (e.g., loading states, error states, hover states). The "Roles" tab is not designed, so you'll infer the design based on what is provided for the "Users" tab.

For those portions of the exercise in which the design is given, your implementation should match the design as closely as possible. Attention to detail is important. It is certainly acceptable to deviate from the design if you are confident it is an improvement, but please explain your thinking in your README.

## Backend API

The API provides full CRUD support for users and roles, but you won’t need to use every endpoint.

**Do not alter the backend API**.

The API includes intentional latency and random server errors to simulate real-world scenarios. Ensure your front-end handles these gracefully.

You can adjust the API speed using the `SERVER_SPEED` environment variable:

- **slow**: Simulate slower network (`SERVER_SPEED=slow npm run api`)
- **instant**: Remove latency (`SERVER_SPEED=instant npm run api`)

You can run backend tests by executing `npm run test` in the `server` directory. The test code is located at `server/src/api.test.ts`.

## Tasks Overview

Work on the following tasks in this order. If you can’t complete all tasks, focus on quality rather than quantity.

- [x] Setup the "Users" and "Roles" tab structure
- [x] Add the users table
- [x] Add support for filtering the users table via the "Search" input field
- [x] Add support for deleting a user via the "more" icon button dropdown menu
- [x] Add support for viewing all roles in the "Roles" tab
- [x] Add support for renaming a role in the "Roles" tab
- [x] [Bonus] Add pagination to the user table

## Evaluation Criteria

We’ll evaluate based on the following:

- **User Experience (UX)**: Clean and intuitive interface.
- **Component Composition**: Modular and reusable components.
- **State Management & Caching**: Efficient handling of data.
- **Error & Loading States**: Graceful handling of API delays and errors.
- **CSS Animations**: Best practices followed for smooth UI interactions.
- **Code Quality**: Clean, well-structured, and maintainable code.
- **Accessibility**: Keyboard navigation and accessibility considerations.

## Submission Guidelines

**Please do not submit a pull request to the WorkOS repo.**

In your forked repository, include a README that explains:

- How to run your project.
- What you would improve or do differently if you had more time.

Once you're ready, share the URL to your GitHub repository with us. Make sure your code runs locally based on the instructions in your README.
