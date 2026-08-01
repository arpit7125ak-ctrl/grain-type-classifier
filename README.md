# Grain Classification UI

A Next.js app that lets users upload a grain image, runs classification using an external ML API, and shows AI-generated grain details in a structured format.

**Repo:** [github.com/arpit7125ak-ctrl/grain-type-classifier](https://github.com/arpit7125ak-ctrl/grain-type-classifier)

## Features

- Upload grain images using click-to-browse or drag-and-drop.
- Instant image preview with filename and formatted file size.
- Calls external prediction API to classify the uploaded grain image.
- Fetches detailed grain information from an internal API route powered by Mistral.
- Displays rich grain details in sections:
  - Basic information
  - Nutritional information
  - Growing conditions
  - Uses
  - Health benefits
  - Storage guidelines
- Loading and error state handling for better user feedback.
- Clean responsive UI styled with Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **LLM integration:** Mistral (`@mistralai/mistralai`)
- **Runtime:** Node.js (for local development and server execution)
- **Linting:** ESLint + `eslint-config-next`

## Project Structure

```text
app/
    page.js                     # redirects to /inputImage
    inputImage/page.js          # main upload + result UI
    api/grain-info/route.js     # server route that queries Mistral for grain details
    globals.css                 # global styles + Tailwind import
    layout.js                   # root layout and fonts
```

## How It Works

1. User uploads an image on `/inputImage`.
2. Client sends the image to:
   - `https://grain-classification-model.onrender.com/predict`
3. API returns predicted grain label.
4. Client sends that label to internal route:
   - `POST /api/grain-info`
5. Internal API requests structured JSON details from Mistral.
6. UI renders classification details in organized cards/sections.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/arpit7125ak-ctrl/grain-type-classifier.git
cd grain-type-classifier
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

### 4. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Notes

- The app currently uses an external hosted prediction endpoint for image classification.
- The root route (`/`) redirects to `/inputImage`.
- Ensure `MISTRAL_API_KEY` is set, otherwise `/api/grain-info` will fail.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/arpit7125ak-ctrl/grain-type-classifier/issues) if you want to contribute.

## License

This project is currently unlicensed. Add a `LICENSE` file to specify usage terms.
