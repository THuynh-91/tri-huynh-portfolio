import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SpotifyPlayer() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);

  // Load songs from songs.md
  useEffect(() => {
    fetch('/songs.md')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(line => line.includes('|'));
        const songList = lines.map(line => {
          const [id, name, artist] = line.split('|');
          return { id: id.trim(), name: name.trim(), artist: artist.trim() };
        });
        setTracks(songList);
      })
      .catch(error => {
        console.error('Error loading songs:', error);
        // Fallback songs if file can't be loaded
        setTracks([
          { id: '3cfOd4CMv2snFaKAnMdnvK', name: 'Sunflower', artist: 'Post Malone, Swae Lee' },
          { id: '0nbXyq5TXYPCO7pr3N8S4I', name: 'Take On Me', artist: 'a-ha' },
        ]);
      });
  }, []);

  const currentTrack = tracks[currentTrackIndex] || { id: '', name: 'Loading...', artist: '' };
  const embedUrl = currentTrack.id ? `https://open.spotify.com/embed/track/${currentTrack.id}?utm_source=generator&theme=0` : '';

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  if (tracks.length === 0) {
    return null; // Don't render until songs are loaded
  }

  return (
    <motion.div
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Keep iframe in DOM but hide it when minimized - this keeps music playing */}
      <div className={isMinimized ? 'sr-only' : ''}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isMinimized ? 0 : 1, scale: isMinimized ? 0 : 1 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl border border-primary/20 overflow-hidden shadow-2xl w-80"
        >
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <p className="text-center text-sm text-gray-300 mb-3">
              🎵 <span className="text-primary font-semibold">What I'm listening to</span>
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{currentTrack.name}</p>
                  <p className="text-primary text-xs truncate">{currentTrack.artist}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                title="Minimize"
              >
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Spotify Player */}
          <div className="rounded-xl overflow-hidden border border-white/10 mb-3" style={{ height: '152px' }}>
            <iframe
              key={currentTrack.id}
              style={{
                width: '100%',
                height: '152px',
                border: 'none'
              }}
              src={embedUrl}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
                title="Previous"
              >
                <svg className="w-4 h-4 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                onClick={nextTrack}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
                title="Next"
              >
                <svg className="w-4 h-4 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400">
              Track {currentTrackIndex + 1} of {tracks.length}
            </div>
          </div>
        </div>
        </motion.div>
      </div>

      {isMinimized && (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-br from-primary to-accent p-4 rounded-2xl hover:shadow-2xl hover:shadow-primary/50 transition-all shadow-xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </motion.button>
      )}
    </motion.div>
  );
}
