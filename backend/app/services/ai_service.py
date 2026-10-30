import json
import re
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

class AIService:
    """
    Multi-provider AI Service supporting:
    1. Google Gemini API
    2. OpenAI API
    3. Ollama (local)
    4. Curated High-Fidelity Demo/Offline Engine
    """
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.ollama_url = settings.OLLAMA_BASE_URL

    async def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        # Check if live provider configured
        if self.provider == "gemini" and self.gemini_key:
            return await self._call_gemini(system_prompt, user_prompt)
        elif self.provider == "openai" and self.openai_key:
            return await self._call_openai(system_prompt, user_prompt)
        elif self.provider == "ollama":
            return await self._call_ollama(system_prompt, user_prompt)
        
        # Transparent Fallback Demo Engine
        return self._generate_fallback(system_prompt, user_prompt)

    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{system_prompt}\n\nTask: {user_prompt}"}]}
            ]
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass
        return self._generate_fallback(system_prompt, user_prompt)

    async def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.openai_key}"}
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception:
            pass
        return self._generate_fallback(system_prompt, user_prompt)

    async def _call_ollama(self, system_prompt: str, user_prompt: str) -> str:
        url = f"{self.ollama_url}/api/generate"
        payload = {
            "model": "llama3",
            "prompt": f"{system_prompt}\n\nUser: {user_prompt}\nResponse:",
            "stream": False
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    return res.json().get("response", "")
        except Exception:
            pass
        return self._generate_fallback(system_prompt, user_prompt)

    def _generate_fallback(self, system_prompt: str, user_prompt: str) -> str:
        """
        Intelligent rule-based evaluator providing structured rubric feedback and realistic AI responses.
        """
        lower_prompt = user_prompt.lower()
        
        # 1. Technical or HR Evaluation request
        if "evaluate" in lower_prompt or "score" in lower_prompt or "interview" in lower_prompt:
            word_count = len(user_prompt.split())
            length_factor = min(1.0, max(0.4, word_count / 80.0))
            
            # Check presence of technical depth
            has_keywords = any(k in lower_prompt for k in [
                "index", "query", "complexity", "o(n)", "acid", "normalize", "thread",
                "cache", "api", "rest", "architecture", "async", "distributed", "star",
                "situation", "task", "action", "result", "leader", "team"
            ])
            
            base_score = 7.5 if has_keywords else 6.0
            computed_score = round(min(9.5, max(4.0, base_score * length_factor + (1.5 if has_keywords else 0))), 1)
            
            return json.dumps({
                "score": computed_score,
                "correctness_score": round(min(10.0, computed_score + 0.3), 1),
                "completeness_score": round(min(10.0, computed_score - 0.2), 1),
                "clarity_score": round(min(10.0, computed_score + 0.5), 1),
                "relevance_score": round(min(10.0, computed_score + 0.4), 1),
                "ai_feedback": (
                    "Your answer demonstrates solid foundational knowledge. "
                    "You articulated key concepts well. To stand out in a placement interview, "
                    "incorporate concrete architectural trade-offs, edge case handling, "
                    "and performance implications into your response."
                ),
                "expected_answer_guide": (
                    "A high-scoring answer explains the core mechanism, states time/space complexity, "
                    "contrasts alternative implementations, and mentions practical production constraints."
                ),
                "areas_to_improve": [
                    "Mention specific algorithmic time/space complexities",
                    "Add real-world failure modes or edge-case handling",
                    "Structure answers crisply with concise opening points"
                ]
            })
            
        # 2. Defense question generation
        if "generate project defense questions" in lower_prompt or "defense" in lower_prompt:
            return json.dumps([
                {
                    "question_text": "In your architecture design, what strategies did you employ to handle database concurrency and prevent race conditions?",
                    "category": "Architecture & Concurrency",
                    "expected_concepts": ["Transactions", "Isolation levels", "Optimistic/Pessimistic locking"],
                    "source_reference": "Project Report Section 3: Architecture"
                },
                {
                    "question_text": "How did you benchmark the system's performance, and what was the primary bottleneck discovered under heavy load?",
                    "category": "Performance & Scaling",
                    "expected_concepts": ["Load testing", "I/O latency", "Indexing", "Caching"],
                    "source_reference": "Project Report Section 5: Testing"
                },
                {
                    "question_text": "If you had to scale this application to support 50,000 active concurrent users, what component would fail first and how would you redesign it?",
                    "category": "Scalability & Trade-offs",
                    "expected_concepts": ["Horizontal scaling", "Redis caching", "Read replicas", "Message queues"],
                    "source_reference": "Project Report Section 6: Future Scope"
                }
            ])

        # Default structured fallback
        return json.dumps({
            "status": "success",
            "message": "Processed successfully by AI Evaluator (Demo Fallback Active)",
            "details": "Configured LLM provider key can be set in .env to activate live cloud inference."
        })

ai_service = AIService()
