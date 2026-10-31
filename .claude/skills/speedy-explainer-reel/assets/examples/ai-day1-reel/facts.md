# Facts — Day 1 (verify before publish)
- Tokens: OpenAI help center rule of thumb "1 token ≈ 4 characters ≈ ¾ of a word" in English.
- GPT-2 vocabulary size: 50,257 tokens (GPT-2 paper, Radford et al. 2019; tokenizer vocab_size 50257).
- GPT-2 small embedding size: 768 numbers per token (n_embd = 768, released model config).
- LLMs generate autoregressively: score all vocabulary tokens (probabilities), sample/pick one, append, repeat.
- Sampling (temperature etc.) is why the same prompt can give different answers.
- Without tools/search, the model answers from learned patterns (prediction), not by looking things up.
On-screen probabilities, token splits and vector values are ILLUSTRATIONS → footnoted.
