
import React, { useState, useCallback } from 'react';
import AnimationStage from './components/AnimationStage';
import { STEPS } from './constants';
import { GoogleGenAI, Modality } from "@google/genai";

// Audio utility: Base64 to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio utility: Raw PCM to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const playExplanation = useCallback(async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const step = STEPS[currentStep];
      const prompt = `Läs upp följande pedagogiska förklaring om blixtar på svenska: ${step.title}. ${step.description}. ${step.longDescription}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is generally clear for various languages
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Speech generation failed:", error);
      setIsSpeaking(false);
    }
  }, [currentStep, isSpeaking]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100">
      <header className="mb-8 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">
          Hur blir en blixt till?
        </h1>
        <p className="text-slate-400 text-lg">
          Följ med på en interaktiv resa genom molnet för att förstå naturens mest kraftfulla gnista.
        </p>
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Animation */}
        <div className="w-full lg:w-3/5 space-y-6">
          <AnimationStage step={currentStep} />
          
          {/* Controls */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentStep === 0 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              Föregående
            </button>

            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-8 rounded-full transition-all duration-500 ${
                    i === currentStep ? 'bg-yellow-400 w-12' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextStep}
              disabled={currentStep === STEPS.length - 1}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentStep === STEPS.length - 1 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'
              }`}
            >
              Nästa steg
            </button>
          </div>
        </div>

        {/* Right Side: Explanation Card */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden h-full min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  Steg {currentStep + 1} av {STEPS.length}
                </span>
                <button 
                  onClick={playExplanation}
                  disabled={isSpeaking}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isSpeaking 
                    ? 'bg-blue-500/40 text-blue-200 cursor-wait' 
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  {isSpeaking ? 'Läser upp...' : 'Lyssna'}
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-white transition-all duration-300">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed mb-6 font-semibold">
                {STEPS[currentStep].description}
              </p>
              <div className="space-y-4 text-slate-400 leading-relaxed text-md transition-opacity duration-500">
                {STEPS[currentStep].longDescription.split('. ').map((sentence, idx) => (
                  <p key={idx}>{sentence}{sentence.endsWith('.') ? '' : '.'}</p>
                ))}
              </div>
            </div>
            
            {currentStep === 4 && (
              <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-medium">
                  <strong>Visste du?</strong> En blixt kan nå temperaturer på 30 000 grader Celsius – fem gånger varmare än solens yta!
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Symbolförklaring</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs text-slate-400">Positiv (+) Ispartikel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-xs text-slate-400">Negativ (-) Hagelkorn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-slate-500 text-sm flex gap-4">
        <span>© 2024 Pedagogisk Blixt-Simulering</span>
        <span>•</span>
        <span>Baserat på naturlagar</span>
      </footer>
    </div>
  );
};

export default App;
