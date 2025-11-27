import google.generativeai as genai
import os
from dotenv import load_dotenv

# 1. Load the .env file
load_dotenv() 

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: Could not find GEMINI_API_KEY in .env file")
else:
    print(f"✅ Found API Key: {api_key[:10]}...")
    
    # 2. Configure Gemini
    genai.configure(api_key=api_key)

    print("\n🔍 Listing available models for this key...")
    try:
        found_any = False
        for m in genai.list_models():
            # We only care about models that can generate text (Content)
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
                found_any = True
        
        if not found_any:
            print("❌ No models found! Your API key might have restricted access.")
            
    except Exception as e:
        print(f"❌ Error contacting Google: {e}")