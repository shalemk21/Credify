'use client';

import { Language } from './i18n';

// Language codes for Web Speech API & SpeechSynthesis
export const LANG_CODES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

// Pre-load voices on client for Chrome/Safari compatibility
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Text-to-speech speaker button helper
 */
export function speakText(
  text: string,
  lang: Language = 'en',
  onEnd?: () => void,
  onError?: (err: any) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_CODES[lang] || 'en-IN';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Attempt to select an Indian regional voice if available
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang) || v.name.includes('India') || v.lang.includes('IN')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  };

  setVoice();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = setVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Helper to convert spoken numbers in English, Hindi, and Kannada into raw digits
 */
export function extractDigitsFromSpeech(transcript: string): string {
  if (!transcript) return '';

  const wordToDigitMap: Record<string, string> = {
    // English
    'zero': '0', 'oh': '0', 'one': '1', 'two': '2', 'to': '2', 'too': '2',
    'three': '3', 'four': '4', 'for': '4', 'five': '5', 'six': '6',
    'seven': '7', 'eight': '8', 'ate': '8', 'nine': '9',
    
    // Hindi Devanagari
    'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
    'पांच': '5', 'पाँच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
    
    // Hindi Transliterated
    'shunya': '0', 'ek': '1', 'do': '2', 'teen': '3', 'char': '4',
    'paanch': '5', 'panch': '5', 'chhah': '6', 'chhe': '6', 'saat': '7', 'aath': '8', 'nau': '9',

    // Kannada
    'ಸೊನ್ನೆ': '0', 'ಒಂದು': '1', 'ಎರಡು': '2', 'ಮೂರು': '3', 'ನಾಲ್ಕು': '4',
    'ಐದು': '5', 'ಆರು': '6', 'ಏಳು': '7', 'ಎಂಟು': '8', 'ಒಂಬತ್ತು': '9',

    // Kannada Transliterated
    'sonne': '0', 'ondu': '1', 'eradu': '2', 'mooru': '3', 'naalku': '4',
    'aidu': '5', 'aaru': '6', 'eylu': '7', 'elu': '7', 'entu': '8', 'ombattu': '9',
  };

  // Replace spoken word numbers with digits
  let cleaned = transcript.toLowerCase();
  for (const [word, digit] of Object.entries(wordToDigitMap)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, digit);
  }

  // Extract all digit characters
  const digits = cleaned.replace(/\D/g, '');
  return digits;
}

/**
 * Creates a SpeechRecognition instance with proper fallbacks
 */
export function createSpeechRecognizer(
  lang: Language,
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = LANG_CODES[lang] || 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript.trim()) {
      onResult(finalTranscript);
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error || 'Recognition error');
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}
