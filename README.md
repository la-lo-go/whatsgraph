# WhatsGraph

WhatsGraph is a web application that allows users to easily visualize their WhatsApp conversation data. It provides insightful charts and analytics based on uploaded chat history files.

## Features

- Upload WhatsApp chat history files (.txt or .zip)
- Analyze conversation data
- Visualize data through various charts:
  - Messages per Day
  - Activity Distribution (Hourly, Weekly, Monthly)
  - Yearly Activity
  - Most Used Words by Sender

  
## How to Use

1. Export your WhatsApp chat history as a .txt file or .zip archive.
2. Visit the [WhatsGraph website](https://whatsgraph.lalogo.dev/).
3. Upload your chat history file using the provided dropzone.
4. Once uploaded, the application will parse and analyze your chat data.
5. Explore various charts and insights about your conversations.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- [Shadcn](https://ui.shadcn.com/) for UI components
- Recharts for data visualization

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Main application pages
- `src/components`: Reusable React components
- `src/utils`: Utility functions for parsing and processing chat data
- `src/components/charts`: Chart components for data visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).