Gemini API quickstart



We have updated our Terms of Service.

This quickstart shows you how to install our libraries and make your first Gemini API request.

Before you begin
To use the Gemini API, you need to have an API key to authenticate your requests, enforce security limits, and track usage to your account.

Create one on AI Studio for free to get started:

Create a Gemini API Key

Install the Google GenAI SDK
Python
JavaScript
Go
Java
C#
Apps Script
Using Python 3.9+, install the google-genai package using the following pip command:


pip install -q -U google-genai
Make your first request
There are two ways you can use to send a request to the Gemini API:

(Recommended) Interactions API is a new primitive with native support for multi-step tool use, orchestration, and complex reasoning flows through typed execution steps. Going forward, new models beyond the core mainline family, along with new agentic capabilities and tools, will launch exclusively on the Interactions API.
generateContent provides a way to generate a simple, stateless response from a model. While we recommend using Interactions API, generateContent is fully supported.
This example that uses the generateContent method to send a request to the Gemini API using the Gemini 2.5 Flash model.

If you set your API key as the environment variable GEMINI_API_KEY, it will be picked up automatically by the client when using the Gemini API libraries. Otherwise you will need to pass your API key as an argument when initializing the client.

Note that all code samples in the Gemini API docs assume that you have set the environment variable GEMINI_API_KEY.

Python
JavaScript
Go
Java
C#
Apps Script
REST

from google import genai

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview", contents="Explain how AI works in a few words"
)
print(response.text)
What's next
Now that you made your first API request, you might want to explore the following guides that show Gemini in action:

Text generation
Image generation
Image understanding
Thinking
Function calling
Long context
Embeddings