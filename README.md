# ซอร์สโค้ดนี้ ใช้สำหรับเป็นตัวอย่างเท่านั้น ถ้านำไปใช้งานจริง ผู้ใช้ต้องจัดการเรื่องความปลอดภัย และ ประสิทธิภาพด้วยตัวเอง

```sh

```

```markdown
# TripMates - Your Perfect Travel Companion Matchmaker

TripMates is an automated workflow built with n8n that leverages the power of AI to connect travelers with highly compatible travel companions. This service acts as an expert travel matching assistant, identifying and presenting the top 3 most compatible travelers based on shared preferences.

---

## How It Works

This n8n workflow operates by:

1.  **Receiving Travel Preferences (Webhook):** When a new traveler's preferences are submitted (e.g., from a web form or application), the **Webhook** node triggers the workflow.
2.  **AI-Powered Matching (AI Agent):** The heart of TripMates is the **AI Agent** node, which uses a pre-defined prompt and the **Google Gemini Chat Model** to compare the new traveler's preferences with existing traveler data. It's specifically instructed to:
    * Act as an expert travel matching assistant.
    * **Always identify and present the top 3 most compatible travelers.**
    * Provide the output in a structured JSON format, including the `id` of the matched traveler and a `reason` for the compatibility.
    * Generate the output in **Thai language**.
3.  **Responding to the Request (Respond to Webhook):** Finally, the **Respond to Webhook** node sends back the AI-generated list of top 3 matching travel companions to the requesting service or application.

---

## Workflow Diagram

```

[Webhook] --\> [AI Agent] --\> [Respond to Webhook]
|                  ^
|                  |
\+------------------+
(Connects to Google Gemini Chat Model for AI processing)

````

---

## Setup and Configuration

To use this workflow, you'll need:

1.  **n8n Instance:** A running n8n instance.
2.  **Google Gemini API Key:** A valid Google Gemini API key configured as a credential within n8n. In this workflow, it's named "Google Gemini(PaLM) Api account" .
3.  **Webhook Integration:** Configure your application or service to send a `POST` request to the webhook URL provided by n8n.

### Webhook Data Structure

The **Webhook** expects a JSON payload with the following structure:

```json
{
  "formData": {
    // Current traveler's preferences
    // Example: "interests": ["hiking", "foodie"], "travel_style": "adventure"
  },
  "dbData": [
    // Array of existing travelers' data from your database
    // Each object should contain a unique "id" and their preferences
    // Example:
    // { "id": "user_001", "interests": ["hiking", "camping"], "travel_style": "adventure" },
    // { "id": "user_002", "interests": ["beach", "relaxing"], "travel_style": "luxury" }
  ]
}
````

### AI Agent Prompt

The AI Agent's prompt is crucial for its matching logic:

```
You are an expert travel matching assistant for a service that connects travelers based on shared preferences. Your primary goal is to **always identify and present the top 3 most compatible travelers**
Output first 3 matching between {{ JSON.stringify($json.body.formData) }} and {{ JSON.stringify($json.body.dbData) }}. 
sample output: 
{
"id": "user_021",
"reason": "bla bla bla"
},
{
"id": "user_032",
"reason": "bla bla bla 1"
},
{
"id": "user_045",
"reason": "bla bla bla 2"
}

output in Thai lang.
don't forget, must output 3 id.
```

-----

## Output Example

The **Respond to Webhook** node will return a JSON array containing the top 3 matching travelers, in Thai:

```json
[
  {
    "id": "user_021",
    "reason": "ชอบกิจกรรมผจญภัยและสำรวจธรรมชาติเหมือนกัน"
  },
  {
    "id": "user_032",
    "reason": "สนใจการท่องเที่ยวเชิงวัฒนธรรมและอาหารท้องถิ่น"
  },
  {
    "id": "user_045",
    "reason": "มีสไตล์การเดินทางที่ผ่อนคลายและเน้นการพักผ่อน"
  }
]
```

-----

## Customization

You can customize this workflow to:

  * **Adjust the AI prompt:** Refine the prompt within the **AI Agent** node to improve matching accuracy or consider different compatibility factors.
  * **Integrate with various databases:** Replace the mock `dbData` in the webhook input with actual database integrations (e.g., PostgreSQL, MongoDB, Airtable) to fetch real-time traveler data.
  * **Expand matching criteria:** Add more fields to `formData` and `dbData` to include additional preferences like budget, travel dates, desired destinations, etc.
  * **Change output language:** Modify the AI prompt to output in a different language if needed.

---


## Frontend Application

The TripMates application includes a simple web-based frontend for user interaction:

*   **`index.html`**: This file provides a comprehensive travel preference form. Users fill out various details such as personal information, travel style, interests, preferred destinations, travel time, duration, budget, group size, and group dynamics. The form uses Tailwind CSS for styling and includes client-side JavaScript to collect data and submit it to the backend server.
*   **`match.html`**: After form submission, users are redirected to this page. It displays the matching results fetched from the backend server. The page includes client-side JavaScript that makes a request to `/get-last-webhook-data` and dynamically renders the top 3 compatible travelers, including their IDs and reasons for compatibility.

## Backend Server (`server.js`)

The `server.js` file acts as an intermediary between the frontend application and the n8n workflow. It is built with Node.js and Express.js and performs the following functions:

*   **Serves Static Files**: It serves `index.html`, `match.html`, and other static assets.
*   **Loads `db.json`**: On startup, it loads existing traveler data from `db.json`, which is then included in the payload sent to the n8n webhook.
*   **`/` Route**: Serves the `index.html` form.
*   **`/match` Route**: Serves the `match.html` page for displaying results.
*   **`/submit-form` Endpoint (POST)**:
    *   Receives form data from `index.html`.
    *   Merges the received `formData` with the `dbData` loaded from `db.json`.
    *   Forwards this combined payload to the n8n webhook URL (`http://localhost:5678/webhook/your-webhook-endpoint`).
    *   Stores the response from the n8n webhook.
    *   Redirects the client to `/match`.
*   **`/get-last-webhook-data` Endpoint (GET)**:
    *   Provides the last stored response from the n8n webhook to `match.html` for display.

This server ensures that the frontend can interact with the n8n workflow seamlessly, handling data preparation and result delivery.

-----

## Support

If you have any questions or need assistance with this n8n workflow, please refer to the n8n documentation or community forums.
