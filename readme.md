--Backend Setup
Open a terminal and navigate to the backend directory.

Run the following command to install dependencies: npm install

Edit the test.json and development.json files in the config directory. Update the database configuration values according to your own credentials. Use PostgreSQL for the database.

Start the backend server using the following command: npm run start

To run tests, use the command: npm run test

Clean Architecture
This project follows the principles of Clean Architecture. The codebase is organized into distinct layers—Entities, Use Cases, and Interface Adapters—to maintain separation of concerns and ensure a modular and scalable structure. By implementing Clean Architecture, the project aims to achieve better maintainability, testability, and flexibility.
