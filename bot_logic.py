import os
from dotenv import load_dotenv
import nltk
from nltk.stem import WordNetLemmatizer
import random
import json
import spacy
from spacy.matcher import Matcher
load_dotenv()
nlp = spacy.load("en_core_web_sm")
lemmatizer = WordNetLemmatizer()
with open("intents.json") as file:
    intents = json.load(file)
fallback_responses = ["I'm not sure how to respond to that.", "Could you rephrase that?", "I don't understand."]
class HelpDeskBot:
    def __init__(self):
        self.matcher = Matcher(nlp.vocab)
    def preprocess(self, text):
        doc = nlp(text.lower())
        result = []
        for token in doc:
            lemma = lemmatizer.lemmatize(token.lemma_)
            if lemma.isalpha():
                result.append(lemma)
        return result
    def predict_intent(self, processed_text):
        for intent in intents['intents']:
            for pattern in intent['patterns']:
                doc = nlp(" ".join(processed_text))
                self.matcher.add("TerminologyList", [nlp.make_doc(pattern)])
                matches = self.matcher(doc)
                if len(matches) > 0:
                    return intent
        return None
    def get_response(self, intent):
        return random.choice(intent['responses']) if intent else random.choice(fallback_responses)
    def handle_query(self, query):
        processed_query = self.preprocess(query)
        intent = self.predict_intent(processed_query)
        response = self.get_response(intent)
        return response
if __name__ == "__main__":
    help_desk_bot = HelpDeskBot()
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        response = help_desk_bot.handle_query(user_input)
        print("Bot:", response)