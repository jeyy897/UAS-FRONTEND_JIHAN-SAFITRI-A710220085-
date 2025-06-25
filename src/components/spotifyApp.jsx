import { useState, useEffect } from 'react';
import { Search, Music2 } from 'lucide-react';
import axios from 'axios';

const SpotifyApp = () => {
  const [trackList, setTrackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const accessToken = "BQDduyvKEnGwvwOz1B_fKh7-LsUjZwwuciULGvr3Mo4fR4DYzTkENvp5Yt1xT83VoiYkBMV-88IgxLe3WjCE5y_5arMl9unlxmvElGVCTn1lcw8AgpodF6vpzYHnNrKheTk7YpWNxOU";

  useEffect(() => {
    if (!searchTerm) return;

    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setTrackList(response.data.tracks.items);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data dari Spotify API");
        setLoading(false);
      }
    };

    fetchTracks();
  }, [searchTerm]);

  return (
    <div>
      {/* Header */}
      <header>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music2 className="h-8 w-8 text-white" />
            <h1>Spotify Track Search</h1>
          </div>
          <span style={{ fontSize: "14px" }}>{trackList.length} Lagu</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Cari lagu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Track List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {loading && <p className="text-center text-green-400">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-6">
          {trackList.map((track) => (
            <div key={track.id} className="track-card">
              <img src={track.album.images[0]?.url} alt={track.name} />
              <div className="track-info">
                <h3>{track.name}</h3>
                <p>Artist: {track.artists.map((a) => a.name).join(', ')}</p>
                <p>Album: {track.album.name}</p>
                {track.preview_url ? (
                  <audio controls>
                    <source src={track.preview_url} type="audio/mpeg" />
                    Browsermu tidak mendukung audio.
                  </audio>
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#666' }}>Preview tidak tersedia</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {trackList.length === 0 && searchTerm && !loading && (
          <div className="text-center py-12">
            <div className="bg-[#181818] rounded-lg shadow-md p-8">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Tidak ada lagu ditemukan untuk "{searchTerm}"</p>
              <p className="text-gray-500 text-sm mt-2">Coba gunakan kata kunci lain</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyApp;
