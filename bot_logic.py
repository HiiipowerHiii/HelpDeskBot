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
    intents_data = json.load(file)

fallback_responses = [
    "I'm not sure how to respond to that.",
    "Could you rephrase that?",
    "I don't understand."
]

class HelpDeskAssistant:
    def __init__(self):
        self.intent_matcher = Matcher(nlp.vocab)
        self.conversation_log_path = "conversation_log.txt"

    def preprocess_query(self, text):
        processed_doc = nlp(text.lower())
        lemmatized_tokens = []
        for token in processed_doc:
            lemmatized_token = lemmatizer.lemmatize(token.lemma_)
            if lemmatized_token.isalpha():
                lemmatized_tokens.append(lemmatized_token)
        return lemmatized_tokens

    def identify_intent(self, lemmatized_query):
        for intent in intents_data['intents']:
            for pattern in intent['patterns']:
                pattern_doc = nlp(" ".join(lemmatized_query))
                self.intent_matcher.add("IntentPatterns", [nlp.make_doc(pattern)], on_match=None)
                pattern_matches = self.intent_matcher(pattern_doc)
                self.intent_matcher.remove('IntentPatterns')
                if len(pattern_matches) > 0:
                    return intent
        return None

    def choose_response(self, matched_intent):
        return random.choice(matched_intent['responses']) if matched_intent else random.choice(fallback_responses)

    def process_user_query(self, user_query):
        lemmatized_query = self.preprocess_query(user_query)
        matched_intent = self.identify_intent(lemmatized_query)
        chosen_response = self.choose_response(matched_intent)
        self.record_conversation(user_query, chosen_response)
        return chosen_response

    def record_conversation(self, user_query, bot_response):
        with open(self.conversation_log_path, 'a') as log_file:
            log_entry = f"User: {user_query}\nBot: {bot_response}\n\n"
            log_file.write(log_entry)
            print("Conversation interaction recorded.")

if __name__ == "__main__":
    conversation_bot = HelpDeskAssistant()
    print("Type 'quit' to exit the conversation.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        bot_response = conversation_bot.process_user_query(user_input)
        print("Bot:", bot_response)