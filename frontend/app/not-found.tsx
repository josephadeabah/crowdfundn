// app/not-found.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Mood = 'playful' | 'disappointed' | 'cheerup';

export default function NotFound() {
  const [mood, setMood] = useState<Mood>('playful');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const moods = {
    playful: {
      title: "Oops! We're Playing Hide & Seek!",
      message: "The page you're looking for is hiding... and it's winning!",
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      emoji: "🔍",
      actionText: "Let's find something else to explore!",
      character: "🤖",
    },
    disappointed: {
      title: "404 - A Sad Robot Story",
      message: "The robot tried to find your page but got distracted by shiny things.",
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      buttonColor: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
      emoji: "🤖",
      actionText: "Help the robot find its way home",
      character: "😢",
    },
    cheerup: {
      title: "Don't be sad! It's an adventure!",
      message: "Every wrong turn is just a new opportunity to discover something amazing!",
      color: "text-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
      buttonColor: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
      emoji: "🌈",
      actionText: "Let's find something wonderful instead!",
      character: "✨",
    },
  };

  const currentMood = moods[mood];

  useEffect(() => {
    // Random mood on load
    const moodsArray: Mood[] = ['playful', 'disappointed', 'cheerup'];
    const randomMood = moodsArray[Math.floor(Math.random() * moodsArray.length)];
    setMood(randomMood);
    
    // Auto-rotate moods every 5 seconds
    const interval = setInterval(() => {
      setMood(prev => {
        const moodsArray: Mood[] = ['playful', 'disappointed', 'cheerup'];
        const currentIndex = moodsArray.indexOf(prev);
        const nextIndex = (currentIndex + 1) % moodsArray.length;
        return moodsArray[nextIndex];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-500 ${currentMood.bgColor}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-20 ${i % 3 === 0 ? 'text-purple-300' : i % 3 === 1 ? 'text-blue-300' : 'text-yellow-300'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 16}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          >
            {['✨', '🌟', '🎈', '🎯', '🎨', '🧩', '🎪', '🎭', '🪅', '🪩'][i % 10]}
          </div>
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                fontSize: '20px',
                animationDelay: `${Math.random() * 2}s`,
                color: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['🎉', '🎊', '✨', '🌟', '🪅', '🎈'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Mood Toggle */}
        <div className="mb-8 flex justify-center gap-3">
          {(['playful', 'disappointed', 'cheerup'] as Mood[]).map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${mood === m ? 'scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              style={{
                backgroundColor: mood === m ? 
                  (m === 'playful' ? '#C084FC' : 
                  m === 'disappointed' ? '#60A5FA' : 
                  '#FBBF24') : '#E5E7EB',
                color: 'white'
              }}
            >
              {m === 'playful' ? '🎭 Playful' : m === 'disappointed' ? '😢 Sad' : '✨ Cheer Up'}
            </button>
          ))}
        </div>

        {/* Animated Character */}
        <div className="mb-8 text-9xl animate-bounce">
          <div className="relative">
            <span>{currentMood.character}</span>
            <div className="absolute -top-2 -right-2 text-4xl animate-ping">
              {currentMood.emoji}
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${currentMood.color} animate-pulse`}>
          {currentMood.title}
        </h1>
        
        <div className="mb-8 text-2xl md:text-3xl">
          <p className="font-bold mb-4">404</p>
          <p className="text-gray-700 mb-4 animate-fade-in">
            {currentMood.message}
          </p>
        </div>

        {/* Fun Facts */}
        <div className="mb-10 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/70 shadow-lg">
          <p className="text-lg text-gray-600 mb-4">
            <span className="font-bold text-gray-800">Did you know?</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-sm">404 errors happen 20 million times per day worldwide</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🕵️</div>
              <p className="text-sm">The first 404 was found by a programmer in 1992</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm">You're in good company - even Google has 404 pages!</p>
            </div>
          </div>
        </div>

        {/* Interactive Robot Message */}
        {mood === 'disappointed' && (
          <div className="mb-8 p-6 bg-blue-100 rounded-2xl animate-shake border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div className="text-left">
                <p className="font-bold text-blue-800">Robo-Buddy says:</p>
                <p className="text-blue-700">"I tried my best! Can we try a different path together?"</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className={`px-8 py-4 text-white font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${currentMood.buttonColor}`}
            onClick={triggerConfetti}
          >
            <span className="flex items-center justify-center gap-2">
              {currentMood.actionText}
              <span className="animate-bounce">🚀</span>
            </span>
          </Link>
          
          <button
            onClick={triggerConfetti}
            className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gray-300"
          >
            <span className="flex items-center justify-center gap-2">
              Throw Confetti! 
              <span className="animate-spin">🎉</span>
            </span>
          </button>
        </div>

        {/* Navigation Help */}
        <div className="text-gray-600">
          <p className="mb-4">Need help finding your way?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              🏠 Home
            </Link>
            <Link href="/info/mentorship" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              👨‍🏫 Mentorship
            </Link>
            <Link href="/info/contactus" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              📞 Contact
            </Link>
            <Link href="/info/blog" className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              📝 Blog
            </Link>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => {
              const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3');
              audio.play();
              triggerConfetti();
            }}
            className="text-sm text-gray-500"
          >
            🎁 Secret surprise button (sshh!)
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}