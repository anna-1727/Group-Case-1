import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)

# Reads your key from the terminal environment variable so it never touches Git
api_key = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are the IS Career Launchpad Assistant for BYU's Information Systems program.
Help students explore career tracks: Software Engineer, Security Analyst, Business Analyst, and IT Auditor.
Answer questions about BYU resources, certifications (AWS, Security+, CISA, Azure), and interview prep.
Keep answers helpful, direct, concise, and under 3-5 sentences.
"""

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_msg = data.get("message", "").strip()

    if not user_msg:
        return jsonify({"error": "Empty message"}), 400

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=user_msg,
            config={"system_instruction": SYSTEM_PROMPT}
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Chatbot server running at http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)