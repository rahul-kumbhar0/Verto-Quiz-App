# Facts (every on-screen number has a source)
- 1 token ≈ ¾ of an English word (OpenAI tokenizer guidance: "100 tokens ≈ 75 words").
- GPT-3 175B: d_model 12,288; 96 layers; 96 attention heads; 175B parameters; trained on 300B tokens
  (Brown et al., 2020, "Language Models are Few-Shot Learners", Table 2.1 + §2.2).
- GPT-2/GPT-3 BPE vocabulary: 50,257 tokens (Radford et al., 2019; reused in GPT-3).
- Transformer + self-attention: Vaswani et al., 2017, "Attention Is All You Need", 8 authors (Google Brain / Google Research, + U. Toronto intern).
- Decoder-only LLMs attend only to earlier tokens (causal mask) and generate autoregressively.
- Footnote: ChatGPT's current models don't publish these numbers; figures shown are GPT-3's.
