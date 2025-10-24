# ToneCheck Bot  

## Overview  
ToneCheck Bot is a Slack integration that analyzes the tone of messages and suggests polite rewrites. It detects Japanese or English, computes sentiment via OpenAI's GPT-4o-mini, and checks for profanity.  

## Setup  
1. Clone this repository and install dependencies with `npm install`.  
2. Copy `.env.example` to `.env` and fill in your `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, and `OPENAI_API_KEY`.  
3. Deploy to a platform like Render or run locally with `node app.js`.  
4. Add the slash command `/check` to your Slack app and point it to your deployed endpoint.  

## Usage  
- Use `/check` followed by a message to receive a sentiment score, tone classification, profanity hits, and polite rewrite suggestions.  

## License  
This project is provided as-is for educational purposes.
