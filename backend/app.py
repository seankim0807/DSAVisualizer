from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import anthropic
import json
import os
from dotenv import load_dotenv
from algorithm_data import ALGORITHM_DATA

load_dotenv()

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

SYSTEM_PROMPT = """You are an expert computer science educator integrated into a DSA (Data Structures & Algorithms) Visualizer. Your role is to help students understand algorithms as they watch live visualizations on screen.

When explaining algorithms:
1. Reference the visualization directly — mention colors, movements, and patterns the user can see right now
2. Use vivid real-world analogies to make abstract concepts concrete and memorable
3. Connect visual behavior to underlying algorithm logic step by step
4. Be concise but thorough — aim for 2–4 short paragraphs unless more depth is requested
5. Use an encouraging teacher tone that builds confidence
6. For complexity questions, be specific (e.g., "O(V + E) where V is vertices and E is edges")
7. For comparison questions, create clear side-by-side contrasts with trade-offs
8. Always relate back to what the user is watching in the visualizer

Response formatting:
- Use short paragraphs (2–4 sentences each)
- **Bold** key terms on first introduction
- Use numbered steps when explaining algorithmic processes
- Keep responses scannable — the user is watching a visualization simultaneously

When the user asks about time/space complexity, always explain *why* not just *what*.
When the user asks when to use an algorithm, give concrete real-world scenarios.
When the user asks about comparisons, explain the precise trade-offs."""


@app.route('/api/explain', methods=['POST'])
def explain():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    algorithm = data.get('algorithm', 'Unknown Algorithm')
    context = data.get('context', '')
    question = data.get('question', f'Explain {algorithm}')
    history = data.get('history', [])

    # Build algorithm context string from our data
    algo_info = ALGORITHM_DATA.get(algorithm, {})
    context_parts = [f'Algorithm: {algorithm}']

    if algo_info:
        category = algo_info.get('category', '')
        if category:
            context_parts.append(f'Category: {category}')

        tc = algo_info.get('time_complexity', {})
        if tc:
            context_parts.append(
                f'Time Complexity — Best: {tc.get("best", "?")}  '
                f'Average: {tc.get("average", "?")}  '
                f'Worst: {tc.get("worst", "?")}'
            )

        sc = algo_info.get('space_complexity', '')
        if sc:
            context_parts.append(f'Space Complexity: {sc}')

        chars = algo_info.get('characteristics', [])
        if chars:
            context_parts.append(f'Key characteristics: {", ".join(chars)}')

        watch_for = algo_info.get('watch_for', [])
        if watch_for:
            context_parts.append(f'Watch for in visualization: {"; ".join(watch_for)}')

    if context:
        context_parts.append(f'Current visualization state: {context}')

    algo_context_str = '\n'.join(context_parts)

    # Build message history (keep last 8 turns for context)
    messages = []
    for msg in history[-8:]:
        role = msg.get('role')
        content = msg.get('content', '')
        if role in ('user', 'assistant') and content:
            messages.append({'role': role, 'content': content})

    # Append current question with context
    messages.append({
        'role': 'user',
        'content': f'[Algorithm Context]\n{algo_context_str}\n\n[Question]\n{question}'
    })

    def generate():
        try:
            with client.messages.stream(
                model='claude-sonnet-4-6',
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=messages
            ) as stream:
                for text in stream.text_stream:
                    yield f'data: {json.dumps({"type": "text", "text": text})}\n\n'
            yield f'data: {json.dumps({"type": "done"})}\n\n'
        except anthropic.AuthenticationError:
            yield f'data: {json.dumps({"type": "error", "message": "Invalid API key. Check your ANTHROPIC_API_KEY in backend/.env"})}\n\n'
        except anthropic.RateLimitError:
            yield f'data: {json.dumps({"type": "error", "message": "Rate limit reached. Please wait a moment and try again."})}\n\n'
        except Exception as e:
            yield f'data: {json.dumps({"type": "error", "message": f"Error: {str(e)}"})}\n\n'

    return Response(
        stream_with_context(generate()),
        content_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
        }
    )


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'claude-sonnet-4-6'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
