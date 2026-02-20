import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Minus, Square, X, Play, Settings, Edit3, Camera, Heart, Users, ChevronRight, ArrowLeft, ShoppingCart, Info, Cpu, Command, Trophy, Activity, Shield, Star, Download, ChevronDown, Gamepad2, Image as ImageIcon, MessageSquare, Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('library'); 
  const [storeSubTab, setStoreSubTab] = useState('home'); 
  const [systemSpecs, setSystemSpecs] = useState(null);
  const [appUsageSeconds, setAppUsageSeconds] = useState(0);
  const [logs, setLogs] = useState(["[SİSTEM] SR Ultimate Global V3.1 Başlatıldı.", "[MOTOR] Donanım taraması yapılıyor..."]);
  
  const [storeGames, setStoreGames] = useState([]);
  const [libraryGames, setLibraryGames] = useState([]); 
  const [wishlist, setWishlist] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [libSearchText, setLibSearchText] = useState(""); 
  const [libSortType, setLibSortType] = useState('playtime'); 
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [selectedLibGame, setSelectedLibGame] = useState(null);
  const [libGameDetails, setLibGameDetails] = useState(null);
  
  const [viewingGame, setViewingGame] = useState(null); 
  const [activeMedia, setActiveMedia] = useState(null); 
  const [lang, setLang] = useState('tr'); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const defaultProfile = { 
      name: "Furky", realName: "Furkan", bio: "SR Ultimate Developer - Pencereden baktığınızda güneşi esirgemiyorsa gökyüzü, birileri bedelini ödediği içindir.", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Furky", 
      status: "online", level: 99, country: "Turkey", countryCode: "tr", favGame: "Elden Ring", 
      role: "developer", profileBg: null, isBgVideo: false, avatarFrame: "neon", profileBgOpacity: 0.15
  };
  
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileComments, setProfileComments] = useState([{id: 1, user: "Sistem", text: "SR Ultimate platformuna hoş geldin.", date: "Az önce"}]);
  const [newComment, setNewComment] = useState("");
  const [activeSettingTab, setActiveSettingTab] = useState('logs');
  
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const screenInputRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);
  const [featuredScreenshot, setFeaturedScreenshot] = useState(null);

  const slides = [
    { id: 1174180, title: "Red Dead Redemption 2", desc: "Amerika'nın acımasız kalbinde destansı bir hayat hikayesi.", price: "19.99 USD", img: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg", tags: ["Açık Dünya", "Başyapıt", "Hikaye Zengin"] },
    { id: 1091500, title: "Cyberpunk 2077", desc: "Güç, gösteriş ve vücut modifikasyonuna takıntılı bir megalopoliste geçen aksiyon-macera RPG'si.", price: "29.99 USD", img: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg", tags: ["RPG", "Bilim Kurgu", "Siberpunk"] },
    { id: 1593500, title: "God of War", desc: "Olimpos Tanrılarından aldığı intikamın üzerinden yıllar geçen Kratos, artık İskandinav Tanrılarının diyarında yaşıyor.", price: "49.99 USD", img: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg", tags: ["Aksiyon", "Mitokojik", "Şaheser"] }
  ];

  const visualCategories = [
      { name: "Aksiyon", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", query: "Action" },
      { name: "Korku", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/270830/header.jpg", query: "Horror" },
      { name: "Açık Dünya", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg", query: "Open World" },
      { name: "Strateji", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg", query: "Strategy" }
  ];

  const fallbackGames = [
      { id: 1174180, name: "Red Dead Redemption 2", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg", price_overview: { final_formatted: "19.99 USD" } },
      { id: 1091500, name: "Cyberpunk 2077", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg", price_overview: { final_formatted: "29.99 USD" } },
      { id: 1593500, name: "God of War", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg", price_overview: { final_formatted: "49.99 USD" } },
      { id: 374320, name: "DARK SOULS III", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/374320/header.jpg", price_overview: { final_formatted: "39.99 USD" } },
      { id: 292030, name: "The Witcher 3: Wild Hunt", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg", price_overview: { final_formatted: "14.99 USD" } }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 7000);
    const usageInterval = setInterval(() => {
        setAppUsageSeconds(prev => {
            const next = prev + 1;
            if(next % 5 === 0) localStorage.setItem('sr_usage_v8', next.toString());
            return next;
        });
    }, 1000);

    const loadData = (key, setter, fallback) => {
        const data = localStorage.getItem(key);
        if (data) { try { setter(JSON.parse(data)); } catch(e) { setter(fallback); } }
        else if (fallback !== undefined) setter(fallback);
    };

    loadData('sr_profile_v8', setProfile, defaultProfile);
    loadData('sr_wishlist_v8', setWishlist, []);
    loadData('sr_favorites_v8', setFavoriteGames, []);
    loadData('sr_screens_v8', setScreenshots, []);
    loadData('sr_feat_screen_v8', setFeaturedScreenshot, null);
    loadData('sr_comments_v8', setProfileComments, [{id: 1, user: "Sistem", text: "SR Ultimate sistemine hoş geldiniz.", date: "Bugün"}]);
    
    const savedUsage = localStorage.getItem('sr_usage_v8');
    if (savedUsage) setAppUsageSeconds(parseInt(savedUsage) || 0);

    if (window.electron) {
      window.electron.getSystemSpecs().then(specs => { setSystemSpecs(specs); addLog(`[DONANIM] ${specs?.gpu || 'Bilinmiyor'} tespit edildi.`); });
      
      const fetchAAA = async () => {
          try {
              const keywords = ["Grand Theft Auto", "Cyberpunk", "Red Dead", "God of War", "Resident Evil", "The Witcher"];
              let allGames = [];
              for (const k of keywords) {
                  const res = await window.electron.searchSteam(k);
                  if (res && Array.isArray(res)) allGames = [...allGames, ...res];
              }
              if(allGames.length === 0) throw new Error("API boş döndü.");
              const unique = Array.from(new Map(allGames.map(item => [item.id, item])).values());
              setStoreGames(unique.sort(() => 0.5 - Math.random()).map(g => ({...g, uniqueKey: `aaa-${g.id}-${Math.random()}`})));
              addLog(`[MAĞAZA] Modern arayüz için AAA oyunlar başarıyla çekildi.`);
          } catch(e) { 
              addLog(`[UYARI] Mağaza sunucusuna ulaşılamadı. Güvenli mod aktif edildi.`); 
              setStoreGames(fallbackGames.map(g => ({...g, uniqueKey: `fall-${g.id}`})));
          }
      };
      fetchAAA();
      
      window.electron.getInstalledGames().then(async (games) => {
          if(!games) return;
          setLibraryGames(games);
          if(games.length > 0) handleLibraryGameClick(games[0]);

          const updatedGames = [...games];
          for(let i=0; i<updatedGames.length; i++) {
              if (updatedGames[i].title.includes("Steam ID:")) {
                  const details = await window.electron.getGameDetails(updatedGames[i].id);
                  if (details && details.name) {
                      updatedGames[i].title = details.name;
                      setLibraryGames([...updatedGames]); 
                  }
              }
          }
      });
    }
    return () => { clearInterval(slideInterval); clearInterval(usageInterval); };
  }, []);

  const addLog = (msg) => { setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50)); };

  const handleSearchChange = async (e) => {
      const val = e.target.value;
      setSearchQuery(val);
      if(val.trim().length > 2) {
          setIsSearching(true);
          try {
              const res = await window.electron.searchSteam(val);
              setSearchResults(res && Array.isArray(res) ? res : []);
          } catch(err) { setSearchResults([]); }
          setIsSearching(false);
      } else {
          setSearchResults([]);
      }
  };

  const handleGlobalSearchSubmit = async (e) => {
      if(e.key === 'Enter' && searchQuery.trim() !== "") {
          setActiveTab('store'); setViewingGame(null); setStoreSubTab('search');
          setSearchResults([]); 
          const res = await window.electron.searchSteam(searchQuery);
          if(res && Array.isArray(res)) setStoreGames(res.map((g, i) => ({...g, uniqueKey: `srch-${g.id}-${i}`})));
      }
  };

  const handleCategoryClick = async (query) => {
      setActiveTab('store'); setViewingGame(null); setStoreSubTab('categories');
      try {
          const res = await window.electron.searchSteam(query);
          if(res && Array.isArray(res)) {
              let extended = [];
              for(let i=0; i<3; i++) { res.forEach(g => extended.push({...g, uniqueKey: `cat-${g.id}-${i}-${Math.random()}`})); }
              setStoreGames(extended); 
          }
      } catch (error) { setStoreGames(fallbackGames); }
  };

  const handleStoreGameClick = async (appId) => {
      setSearchQuery(""); setSearchResults([]); 
      setActiveTab('store');
      addLog(`[DETAY] Oyun ID: ${appId} açılıyor...`);
      const details = await window.electron.getGameDetails(appId);
      if(details) {
          setViewingGame(details);
          if(details.movies && details.movies.length > 0) {
              setActiveMedia({ type: 'video', url: details.movies[0].mp4?.max || details.movies[0].webm?.max });
          } else if(details.screenshots && details.screenshots.length > 0) {
              setActiveMedia({ type: 'image', url: details.screenshots[0].path_full });
          } else setActiveMedia(null);
      }
  };

  const handleLibraryGameClick = async (game) => {
      setSelectedLibGame(game);
      setLibGameDetails(null); 
      const details = await window.electron.getGameDetails(game.id);
      if(details) setLibGameDetails(details);
  };

  const navigateToLibraryGame = (gameId) => {
      const game = libraryGames.find(g => g.id === gameId);
      if (game) { setActiveTab('library'); handleLibraryGameClick(game); }
  };

  const toggleFavorite = (appId) => {
      let updated = [...favoriteGames];
      if(updated.includes(appId)) updated = updated.filter(id => id !== appId);
      else updated.push(appId);
      setFavoriteGames(updated);
      localStorage.setItem('sr_favorites_v8', JSON.stringify(updated));
  };

  const toggleWishlist = (gameDetails) => {
      let updated = [...wishlist];
      const exists = updated.find(g => g.id === gameDetails.steam_appid);
      if(exists) {
          updated = updated.filter(g => g.id !== gameDetails.steam_appid);
          addNotification(`${gameDetails.name} istek listesinden çıkarıldı.`);
      } else {
          updated.push({ id: gameDetails.steam_appid, name: gameDetails.name, img: gameDetails.header_image, price: gameDetails.price_overview?.final_formatted || "Ücretsiz" });
          addNotification(`${gameDetails.name} İstek Listesine eklendi!`);
      }
      setWishlist(updated);
      localStorage.setItem('sr_wishlist_v8', JSON.stringify(updated));
  };

  const addNotification = (msg) => {
      setNotifications(prev => [{id: Date.now(), msg, time: new Date().toLocaleTimeString().slice(0,5)}, ...prev]);
      setShowNotifPanel(true);
      setTimeout(() => setShowNotifPanel(false), 5000);
  };

  const addComment = (e) => {
      if(e.key === 'Enter' && newComment.trim() !== "") {
          const updated = [{id: Date.now(), user: profile.name, text: newComment, date: new Date().toLocaleDateString('tr-TR')}, ...profileComments];
          setProfileComments(updated);
          localStorage.setItem('sr_comments_v8', JSON.stringify(updated));
          setNewComment("");
      }
  };

  const deleteComment = (id) => {
      const updated = profileComments.filter(c => c.id !== id && c.user !== "Sistem"); 
      setProfileComments(updated);
      localStorage.setItem('sr_comments_v8', JSON.stringify(updated));
  };

  const removeScreenshot = (index) => {
      const updated = screenshots.filter((_, i) => i !== index);
      setScreenshots(updated);
      localStorage.setItem('sr_screens_v8', JSON.stringify(updated));
      if (featuredScreenshot === index) setFeaturedScreenshot(null);
  };

  const saveProfile = () => { localStorage.setItem('sr_profile_v8', JSON.stringify(profile)); setIsEditingProfile(false); addLog("[SİSTEM] Profil ayarları kaydedildi."); };
  
  const getFormatTime = (sec) => { if(isNaN(sec) || sec === null) return "0s 0d"; return `${Math.floor(sec / 3600)} Saat ${Math.floor((sec % 3600) / 60)} Dk`; };
  const formatPlayTime = (minutes) => { if(!minutes || isNaN(minutes) || minutes === 0) return "Hiç oynanmadı"; return `${(minutes / 60).toFixed(1)} saat`; };
  const formatLastPlayed = (timestamp) => { if(!timestamp || isNaN(timestamp) || timestamp === 0) return "Hiç oynanmadı"; return new Date(timestamp * 1000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }); };

  const getSimulatedAchievements = (appId) => {
      if(!appId) return { current: 0, total: 0, percentage: 0 };
      const idNum = parseInt(appId) || 0;
      if (idNum === 0) return { current: 0, total: 0, percentage: 0 };
      const total = (idNum % 50) + 20; 
      const current = (idNum % total) + 5; 
      return { current, total, percentage: Math.round((current / total) * 100) };
  };

  const analyzeRealFPS = () => {
      if(!systemSpecs || !systemSpecs.gpu || !selectedLibGame) return "Analiz ediliyor...";
      const gpu = systemSpecs.gpu?.toLowerCase() || "";
      let base = 60;
      if(gpu.includes('5090') || gpu.includes('4090')) base = 280;
      else if(gpu.includes('5080') || gpu.includes('4080')) base = 200;
      else if(gpu.includes('5070') || gpu.includes('4070')) base = 150; 
      else if(gpu.includes('4060') || gpu.includes('3060')) base = 90;
      else if(gpu.includes('1650') || gpu.includes('1060')) base = 45;

      const hash = selectedLibGame.id.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const uniqueMod = (hash % 40) - 20; 

      let multiplier = 1.0;
      const title = selectedLibGame.title?.toLowerCase() || "";
      if(title.includes('cyberpunk') || title.includes('ark')) multiplier = 0.55; 
      else if(title.includes('red dead') || title.includes('god of war')) multiplier = 0.75;
      else if(title.includes('cs') || title.includes('counter') || title.includes('valorant')) multiplier = 3.2; 
      else if(title.includes('postal') || title.includes('half-life')) multiplier = 4.5;

      return `${Math.floor((base * multiplier) + uniqueMod)} FPS`;
  };

  const StatusIcon = ({ status, size=14 }) => {
      const s = `${size}px`;
      if(status === 'online') return <div style={{width: s, height: s}} className="rounded-full bg-[#53a4c4] border-[2px] border-[#1b2838] shadow-[0_0_5px_#53a4c4]"></div>;
      if(status === 'idle') return <div style={{width: s, height: s}} className="rounded-full bg-[#f0b232] border-[2px] border-[#1b2838] relative"><div className="absolute top-0 left-0 w-full h-full bg-[#1b2838] rounded-full transform -translate-x-[30%] -translate-y-[30%] scale-75"></div></div>;
      if(status === 'dnd') return <div style={{width: s, height: s}} className="rounded-full bg-[#f23f42] border-[2px] border-[#1b2838] flex items-center justify-center"><div className="w-[60%] h-[3px] bg-[#1b2838] rounded-full"></div></div>;
      return <div style={{width: s, height: s}} className="rounded-full bg-[#80848e] border-[2px] border-[#1b2838] flex items-center justify-center"><div className="w-1/2 h-1/2 rounded-full border-[2px] border-[#1b2838]"></div></div>;
  };

  const getFrameCSS = (frameType) => {
      switch(frameType) {
          case 'neon': return "border-[3px] border-[#00ffcc] shadow-[0_0_15px_#00ffcc,inset_0_0_15px_#00ffcc]";
          case 'gold': return "border-[3px] border-[#ffd700] shadow-[0_0_10px_#ffd700]";
          case 'dragon': return "border-[3px] border-[#ff4500] shadow-[0_0_20px_#ff0000]";
          default: return "border-2 border-[#53a4c4]"; 
      }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const path = `file://${file.path}`; setProfile({ ...profile, image: path }); }
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const path = `file://${file.path}`; setProfile({ ...profile, profileBg: path, isBgVideo: file.type.includes('video') }); }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const path = `file://${file.path}`;
      const arr = [path, ...screenshots].slice(0, 6); 
      setScreenshots(arr);
      localStorage.setItem('sr_screens_v8', JSON.stringify(arr));
      if(arr.length === 1) setFeaturedScreenshot(0); 
    }
  };

  const searchTextSafe = (libSearchText || "").toLowerCase();
  let processedLibraryGames = libraryGames.filter(g => (g.title || "").toLowerCase().includes(searchTextSafe));
  if (libSortType === 'alpha') processedLibraryGames.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  else if (libSortType === 'playtime') processedLibraryGames.sort((a, b) => (b.playtime || 0) - (a.playtime || 0));

  const favGamesList = processedLibraryGames.filter(g => favoriteGames.includes(g.id));
  const normalGamesList = processedLibraryGames.filter(g => !favoriteGames.includes(g.id));
  const recentGames = [...libraryGames].filter(g => g.playtime > 0).sort((a,b) => b.lastPlayed - a.lastPlayed).slice(0,3);

  const renderStore = () => {
      if (viewingGame) {
          return (
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0f16] animate-fade-in relative">
                  <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none">
                      <img src={viewingGame.background || viewingGame.header_image} className="w-full h-full object-cover opacity-[0.15] blur-xl mask-image-b-gradient" />
                  </div>
                  
                  <div className="sticky top-0 z-50 bg-[#0a0f16]/90 backdrop-blur-md border-b border-[#2a475e]/30 px-10 py-3 flex gap-6 text-[13px] font-bold text-[#8f98a0]">
                      <span onClick={() => {setViewingGame(null); setStoreSubTab('home');}} className="hover:text-white cursor-pointer transition">Mağaza Ana Sayfa</span>
                      <span className="text-white border-b-2 border-[#1a9fff] pb-3 -mb-3 cursor-default">Oyun Detayı</span>
                  </div>

                  <div className="max-w-[1200px] mx-auto p-10 relative z-10">
                      <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-2xl tracking-wide">{viewingGame.name}</h1>
                      
                      <div className="flex gap-8 mb-12">
                          <div className="flex-[3] flex flex-col gap-2 shrink-0 shadow-2xl">
                              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#2a475e]/50 relative group">
                                  {activeMedia?.type === 'video' ? (
                                      <video key={activeMedia.url} autoPlay loop controls className="w-full h-full object-contain">
                                          <source src={activeMedia.url} type={activeMedia.url?.includes('.webm') ? 'video/webm' : 'video/mp4'} />
                                      </video>
                                  ) : <img src={activeMedia?.url || viewingGame.header_image} className="w-full h-full object-contain"/>}
                              </div>
                              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                                  {viewingGame.movies?.map(m => (
                                      <div key={m.id} onClick={() => setActiveMedia({type: 'video', url: m.mp4?.max || m.webm?.max})} className={`relative w-32 aspect-video shrink-0 cursor-pointer rounded overflow-hidden border-2 ${activeMedia?.url === (m.mp4?.max || m.webm?.max) ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'} transition-all`}>
                                          <img src={m.thumbnail} className="w-full h-full object-cover" />
                                          <Play size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
                                      </div>
                                  ))}
                                  {viewingGame.screenshots?.map(s => (
                                      <img key={s.id} onClick={() => setActiveMedia({type: 'image', url: s.path_full})} src={s.path_thumbnail} className={`w-32 aspect-video shrink-0 object-cover cursor-pointer rounded border-2 ${activeMedia?.url === s.path_full ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'} transition-all`}/>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                              <img src={viewingGame.header_image} className="w-full rounded-lg shadow-lg mb-4 border border-[#2a475e]/30" />
                              <div className="text-sm text-[#acb2b8] leading-relaxed mb-6 line-clamp-[8]" dangerouslySetInnerHTML={{__html: viewingGame.short_description || "Açıklama bulunamadı."}}></div>
                              <div className="bg-[#1b2838]/50 p-4 rounded-lg border border-[#2a475e]/30 text-xs space-y-2 mb-6">
                                  <div className="flex"><span className="w-24 text-[#556772] uppercase font-bold">Çıkış Tarihi:</span> <span className="text-[#8f98a0]">{viewingGame.release_date?.date || "Bilinmiyor"}</span></div>
                                  <div className="flex"><span className="w-24 text-[#556772] uppercase font-bold">Geliştirici:</span> <span className="text-[#66c0f4] hover:text-white cursor-pointer">{viewingGame.developers?.[0] || "Bilinmiyor"}</span></div>
                                  <div className="flex"><span className="w-24 text-[#556772] uppercase font-bold">Yayıncı:</span> <span className="text-[#66c0f4] hover:text-white cursor-pointer">{viewingGame.publishers?.[0] || "Bilinmiyor"}</span></div>
                              </div>
                              <div className="mt-auto flex gap-2">
                                  <button onClick={() => toggleWishlist(viewingGame)} className="flex-1 bg-[#2a475e] hover:bg-[#1a9fff] hover:text-black text-white px-3 py-2.5 rounded text-xs font-bold transition flex items-center justify-center gap-2">
                                      <Heart size={16} className={wishlist.find(g => g.id === viewingGame.steam_appid) ? "fill-current text-white" : ""}/> 
                                      İstek Listesine Ekle
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#171e27] to-[#1b2838] p-1 rounded-xl mb-12 shadow-2xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]"></div>
                          <div className="bg-[#10141b] p-6 rounded-lg flex justify-between items-center relative z-10">
                              <h2 className="text-2xl font-bold text-white">{viewingGame.name} Satın Alın</h2>
                              <div className="bg-black/60 p-1.5 rounded-lg flex items-center border border-[#2a475e]/50">
                                  <div className="text-xl font-black text-[#1a9fff] px-6">{viewingGame.price_overview ? viewingGame.price_overview.final_formatted : "Oynaması Ücretsiz"}</div>
                                  <button className="bg-gradient-to-r from-[#75b022] to-[#588a1b] text-[#d2efa9] px-8 py-3 rounded-md shadow-lg hover:brightness-125 transition-all font-bold flex items-center gap-2 transform hover:scale-105"><ShoppingCart size={20}/> Sepete Ekle</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#0a0f16]">
             <div className="bg-[#10141b] py-3 px-10 flex gap-8 text-sm font-bold text-[#8f98a0] shadow-md border-b border-[#2a475e]/30 sticky top-0 z-40">
                <span onClick={() => setStoreSubTab('home')} className={`cursor-pointer transition ${storeSubTab === 'home' ? 'text-white border-b-2 border-[#1a9fff] pb-3 -mb-3' : 'hover:text-white'}`}>Sizin Mağazanız</span>
                <span onClick={() => setStoreSubTab('new')} className={`cursor-pointer transition ${storeSubTab === 'new' ? 'text-white border-b-2 border-[#1a9fff] pb-3 -mb-3' : 'hover:text-white'}`}>Yeni ve Dikkat Çekenler</span>
                <span onClick={() => setStoreSubTab('categories')} className={`cursor-pointer transition ${storeSubTab === 'categories' ? 'text-white border-b-2 border-[#1a9fff] pb-3 -mb-3' : 'hover:text-white'}`}>Kategoriler</span>
                <span onClick={() => setStoreSubTab('search')} className={`cursor-pointer transition ${storeSubTab === 'search' ? 'text-white border-b-2 border-[#1a9fff] pb-3 -mb-3' : 'hover:text-white'}`}>Arama Sonuçları</span>
             </div>

             <div className="max-w-[1400px] mx-auto w-full px-10 pt-10 pb-20">
                 
                 {storeSubTab === 'home' && (
                     <>
                         <h2 className="text-white font-normal text-2xl mb-6 tracking-wide drop-shadow-md">Öne Çıkanlar ve Tavsiye Edilenler</h2>
                         <div className="relative h-[480px] w-full bg-[#000000] flex rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group overflow-hidden border border-transparent hover:border-[#2a475e] transition duration-500 mb-16" onClick={() => handleStoreGameClick(slides[currentSlide].id)}>
                             <div className="absolute inset-0 z-0">
                                 <img src={slides[currentSlide].img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-60 group-hover:opacity-80" />
                                 <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f16] via-[#0a0f16]/80 to-transparent"></div>
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-transparent to-transparent"></div>
                             </div>
                             <div className="flex-1 p-12 flex flex-col justify-center relative z-10 w-1/2">
                                 <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl leading-tight">{slides[currentSlide].title}</h1>
                                 <p className="text-[#acb2b8] text-lg mb-8 leading-relaxed max-w-lg">{slides[currentSlide].desc}</p>
                                 <div className="flex gap-3 flex-wrap mb-8">
                                     {slides[currentSlide].tags.map(tag => <span key={tag} className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 text-sm rounded-full shadow">{tag}</span>)}
                                 </div>
                                 <div className="mt-auto">
                                     <div className="text-3xl font-black text-white bg-gradient-to-r from-[#1a9fff] to-[#2a475e] inline-block px-8 py-3 rounded-lg shadow-[0_10px_20px_rgba(26,159,255,0.3)]">{slides[currentSlide].price}</div>
                                 </div>
                             </div>
                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                 {slides.map((_, idx) => (
                                     <div key={idx} onClick={(e) => {e.stopPropagation(); setCurrentSlide(idx);}} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${idx === currentSlide ? 'w-10 bg-[#1a9fff] shadow-[0_0_10px_#1a9fff]' : 'w-3 bg-white/30 hover:bg-white/50'}`}></div>
                                 ))}
                             </div>
                         </div>
                     </>
                 )}

                 {(storeSubTab === 'home' || storeSubTab === 'categories') && (
                     <>
                         <h2 className="text-white font-normal text-xl mb-6 tracking-wide">Kategorilere Göz Atın</h2>
                         <div className="flex gap-5 overflow-x-auto custom-scrollbar pb-6 mb-16 snap-x">
                             {visualCategories.map((cat, i) => (
                                 <div key={i} onClick={() => handleCategoryClick(cat.query)} className="relative w-[300px] h-40 rounded-xl overflow-hidden shrink-0 cursor-pointer group shadow-lg snap-center">
                                     <div className="absolute inset-0 bg-gradient-to-t from-[#1a9fff]/80 to-transparent z-10 group-hover:from-[#1a9fff] transition duration-500"></div>
                                     <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                     <div className="absolute inset-0 flex items-center justify-center z-20">
                                         <div className="bg-black/40 backdrop-blur-sm border border-white/20 text-white font-black uppercase px-8 py-3 rounded-lg shadow-2xl text-lg tracking-widest">{cat.name}</div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </>
                 )}

                 {(storeSubTab === 'home' || storeSubTab === 'new' || storeSubTab === 'search' || storeSubTab === 'categories') && (
                     <>
                         <h2 className="text-white font-normal text-xl mb-6 tracking-wide">
                             {storeSubTab === 'search' ? `Arama Sonuçları (${storeGames.length})` : `Oyunlar (${storeGames.length})`}
                         </h2>
                         {storeGames.length === 0 ? (
                             <div className="text-[#8f98a0] text-sm flex items-center gap-3">
                                 <div className="w-4 h-4 border-2 border-[#8f98a0] border-t-transparent rounded-full animate-spin"></div>
                                 Sunucudan veriler çekiliyor veya sonuç bulunamadı...
                             </div>
                         ) : (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {storeGames.map((game, i) => (
                                   <div key={game.uniqueKey || i} onClick={() => handleStoreGameClick(game.steam_appid || game.id)} className="bg-[#16202d] rounded-lg shadow-xl hover:shadow-[0_0_20px_rgba(26,159,255,0.3)] hover:-translate-y-2 transition duration-300 cursor-pointer group flex flex-col overflow-hidden border border-transparent hover:border-[#1a9fff]/50">
                                      <div className="relative w-full aspect-[460/215] overflow-hidden bg-[#000]">
                                         <img src={game.header_image || game.tiny_image} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
                                      </div>
                                      <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-[#16202d] to-[#101318]">
                                         <div className="text-[15px] font-bold text-[#c6d4df] group-hover:text-white mb-3 line-clamp-2 leading-snug">{game.name}</div>
                                         <div className="mt-auto flex justify-between items-end">
                                             <div className="text-[#8f98a0] text-xs px-2 py-1 bg-black/30 rounded border border-white/5">Oyun</div>
                                             <div className="text-[#1a9fff] font-black text-sm">{game.price_overview ? game.price_overview.final_formatted : (game.price ? (game.price.final/100) + " TL" : "Ücretsiz")}</div>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                         )}
                     </>
                 )}
             </div>
          </div>
      );
  };

  const renderLibrary = () => (
      <div className="flex h-full w-full bg-[#1e2024] animate-fade-in relative">
         <div className="w-[300px] bg-[#141518] flex flex-col shrink-0 z-20 border-r border-[#1a1b1e]">
            <div className="flex flex-col p-4 gap-3">
                <div className="flex items-center bg-[#25282e] rounded border border-transparent focus-within:border-[#1a9fff] transition p-1 shadow-inner">
                    <Search size={16} className="text-[#a8b1b8] ml-2"/>
                    <input type="text" placeholder="Kütüphanede ara..." value={libSearchText} onChange={(e) => setLibSearchText(e.target.value)} className="w-full bg-transparent text-[#dcdedf] p-1.5 text-sm outline-none"/>
                </div>
                <div className="flex items-center justify-between px-1 text-[11px] text-[#748796] font-bold uppercase tracking-wider">
                    <span>Oyunlar</span>
                    <select value={libSortType} onChange={e => setLibSortType(e.target.value)} className="bg-transparent outline-none cursor-pointer hover:text-white">
                        <option value="alpha">Alfabetik</option>
                        <option value="playtime">Oynama Süresi</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
               {processedLibraryGames.length === 0 ? (
                   <div className="text-xs text-gray-500 text-center mt-4">Oyun bulunamadı.</div>
               ) : (
                   <div>
                       {favGamesList.length > 0 && (
                           <div className="mb-6">
                               <div className="text-[11px] font-bold text-[#1a9fff] uppercase tracking-widest px-5 mb-2">Favoriler ({favGamesList.length})</div>
                               {favGamesList.map(game => (
                                  <div key={game.id} onClick={() => handleLibraryGameClick(game)} className={`flex items-center gap-3 px-5 py-2 cursor-pointer group transition ${selectedLibGame?.id === game.id ? 'bg-[#3e4451] text-white border-l-4 border-[#1a9fff]' : 'text-[#8f98a0] hover:bg-[#2e323b] hover:text-white border-l-4 border-transparent'}`}>
                                     <img src={game.icon} onError={(e)=>{e.target.src=game.img}} className={`w-7 h-7 rounded shadow-md object-cover ${!game.installed && 'opacity-40 grayscale'}`} />
                                     <span className={`text-[14px] font-medium truncate ${!game.installed && 'text-[#748796]'}`}>{game.title}</span>
                                     {game.installed && <div className="ml-auto w-2 h-2 bg-[#1a9fff] rounded-full shadow-[0_0_8px_#1a9fff]"></div>}
                                  </div>
                               ))}
                           </div>
                       )}
                       
                       <div className="text-[11px] font-bold text-[#748796] uppercase tracking-widest px-5 mb-2">Tüm Oyunlar ({normalGamesList.length})</div>
                       {normalGamesList.map(game => (
                          <div key={game.id} onClick={() => handleLibraryGameClick(game)} className={`flex items-center gap-3 px-5 py-2 cursor-pointer group transition ${selectedLibGame?.id === game.id ? 'bg-[#3e4451] text-white border-l-4 border-[#1a9fff]' : 'text-[#8f98a0] hover:bg-[#2e323b] hover:text-white border-l-4 border-transparent'}`}>
                             <img src={game.icon} onError={(e)=>{e.target.src=game.img}} className={`w-7 h-7 rounded shadow-md object-cover ${!game.installed && 'opacity-40 grayscale'}`} />
                             <span className={`text-[14px] font-medium truncate ${!game.installed && 'text-[#748796]'}`}>{game.title}</span>
                             {game.installed && <div className="ml-auto w-2 h-2 bg-[#1a9fff] rounded-full shadow-[0_0_8px_#1a9fff]"></div>}
                          </div>
                       ))}
                   </div>
               )}
            </div>
         </div>
         
         <div className="flex-1 relative flex flex-col bg-[#1e2024] overflow-y-auto custom-scrollbar">
            {selectedLibGame ? (
               <div>
                  <div className="h-[400px] relative w-full shrink-0 bg-[#0a0f16]">
                     <img src={libGameDetails?.background || selectedLibGame.header} className="w-full h-full object-cover mask-image-b-gradient opacity-60 blur-[2px]" />
                     <div className="absolute bottom-12 left-12 z-20">
                         <img src={selectedLibGame.logo || selectedLibGame.header} className="max-w-[450px] max-h-[160px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
                     </div>
                 </div>
                 
                 <div className="bg-gradient-to-b from-[#191a1e] to-[#1e2024] border-b border-[#2a2c31] sticky top-0 z-30 shadow-xl">
                     <div className="flex items-center gap-10 px-12 py-5">
                         <button onClick={() => window.electron.launchGame({appId: selectedLibGame.id, action: selectedLibGame.installed ? 'run' : 'install'})} className={`px-16 py-4 rounded-lg text-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform active:scale-95 hover:-translate-y-1 ${selectedLibGame.installed ? 'bg-gradient-to-r from-[#47b738] to-[#54d243] text-white hover:brightness-110' : 'bg-gradient-to-r from-[#0062ff] to-[#0074ff] text-white hover:brightness-110'}`}>
                             {selectedLibGame.installed ? <Play fill="currentColor" size={24}/> : <Download size={24}/>} 
                             {selectedLibGame.installed ? "OYNA" : "YÜKLE"}
                         </button>
                         
                         <div className="flex gap-12 bg-black/20 p-4 rounded-lg border border-white/5">
                             {!selectedLibGame.installed && (
                                 <div className="flex flex-col">
                                     <span className="text-[11px] text-[#748796] font-bold uppercase tracking-widest">Gerekli Alan</span>
                                     <span className="text-[#dcdedf] text-base font-medium">{selectedLibGame.size || "Bilinmiyor"}</span>
                                 </div>
                             )}
                             <div className="flex flex-col">
                                 <span className="text-[11px] text-[#748796] font-bold uppercase tracking-widest">Son Oynama</span>
                                 <span className="text-[#dcdedf] text-base font-medium">{formatLastPlayed(selectedLibGame.lastPlayed)}</span>
                             </div>
                             <div className="flex flex-col">
                                 <span className="text-[11px] text-[#748796] font-bold uppercase tracking-widest">Oynama Süresi</span>
                                 <span className="text-[#dcdedf] text-base font-medium">{formatPlayTime(selectedLibGame.playtime)}</span>
                             </div>
                             <div className="flex flex-col w-56">
                                 <span className="text-[11px] text-[#748796] font-bold uppercase tracking-widest flex items-center gap-1.5"><Trophy size={12}/> Başarımlar</span>
                                 <div className="flex items-center gap-3 mt-1">
                                     <div className="flex-1 bg-[#141518] h-2 rounded-full overflow-hidden border border-[#2a2c31]">
                                         <div className="bg-[#1a9fff] h-full shadow-[0_0_10px_#1a9fff]" style={{width: `${getSimulatedAchievements(selectedLibGame.id).percentage}%`}}></div>
                                     </div>
                                     <span className="text-[#dcdedf] text-sm font-bold">{getSimulatedAchievements(selectedLibGame.id).current}/{getSimulatedAchievements(selectedLibGame.id).total}</span>
                                 </div>
                             </div>
                         </div>
                         <button onClick={() => toggleFavorite(selectedLibGame.id)} className={`p-4 rounded-lg transition ml-auto border ${favoriteGames.includes(selectedLibGame.id) ? 'bg-[#1a9fff]/10 border-[#1a9fff] text-[#1a9fff] shadow-[0_0_15px_rgba(26,159,255,0.2)]' : 'bg-[#2a2c31] border-transparent text-[#dcdedf] hover:bg-[#32353b]'}`}><Star size={24} className={favoriteGames.includes(selectedLibGame.id) ? "fill-current" : ""}/></button>
                     </div>
                 </div>

                 <div className="p-12 flex gap-10">
                      <div className="flex-[2] flex flex-col gap-8">
                          <div className="bg-[#212329] border border-[#2a2c31] p-8 rounded-xl shadow-xl">
                              <h3 className="text-[#1a9fff] font-bold mb-4 text-lg border-b border-[#2a2c31] pb-2">Oyun Hakkında</h3>
                              {libGameDetails ? <div className="text-[15px] text-[#acb2b8] leading-relaxed" dangerouslySetInnerHTML={{__html: libGameDetails.detailed_description || libGameDetails.short_description}}></div> : <div className="text-sm text-gray-500">Steam veritabanından bilgiler yükleniyor...</div>}
                          </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-8">
                          <div>
                              <h3 className="text-[#dcdedf] font-bold mb-4 tracking-wide text-sm uppercase">Dinamik AI FPS Analizi</h3>
                              <div className="bg-gradient-to-br from-[#1b2838] to-[#101216] border border-[#1a9fff]/30 p-8 rounded-xl text-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1a9fff] to-transparent opacity-50"></div>
                                  <div className="text-6xl font-black text-[#1a9fff] drop-shadow-[0_0_20px_rgba(26,159,255,0.4)] tracking-tighter">{analyzeRealFPS()}</div>
                                  <div className="text-[#8f98a0] text-xs mt-4 bg-black/40 py-2 px-4 rounded-full inline-block border border-white/5">Donanım: {systemSpecs?.gpu}</div>
                              </div>
                          </div>
                      </div>
                  </div>
               </div>
            ) : <div className="h-full flex items-center justify-center text-[#556772] text-2xl font-black tracking-widest uppercase opacity-50">Kütüphaneden oyun seçin</div>}
         </div>
      </div>
  );

  const renderCommunity = () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#171a21] animate-fade-in p-10 text-center">
          <Users size={80} className="text-[#2a475e] mb-6"/>
          <h1 className="text-4xl font-black text-white mb-4">TOPLULUK</h1>
          <p className="text-[#8f98a0] max-w-lg text-lg">Topluluk sekmesi çok yakında sizlerle olacak. Geliştirme aşamasında.</p>
      </div>
  );

  const renderProfile = () => (
      <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-20 bg-[#171a21]">
          {/* PROFİL ARKAPLANI VE ŞEFFAFLIK */}
          <div className="fixed inset-0 z-0 pointer-events-none">
              {profile.profileBg ? (
                  profile.isBgVideo ?
                  <video src={profile.profileBg} autoPlay loop muted style={{ opacity: profile.profileBgOpacity }} className="w-full h-full object-cover"/> :
                  <img src={profile.profileBg} style={{ opacity: profile.profileBgOpacity }} className="w-full h-full object-cover" />
              ) : (
                  <div className="w-full h-full bg-[#171a21]"></div>
              )}
          </div>

          <div className="max-w-[1200px] mx-auto p-10 relative z-10 pt-16">
              <div className="bg-[#1b2838]/80 backdrop-blur-xl p-10 rounded-2xl border border-[#2a475e]/50 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex gap-10 items-start mb-12 relative">
                  <button onClick={() => setIsEditingProfile(true)} className="absolute top-6 right-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm bg-black/40 px-4 py-2 rounded-lg transition border border-transparent hover:border-[#66c0f4]/50 font-medium"><Edit3 size={16}/> Profili Düzenle</button>
                  
                  <div className="relative shrink-0 z-[150] group">
                      <div className={`w-44 h-44 rounded relative z-10 bg-[#171d25] p-1 ${getFrameCSS(profile.avatarFrame)}`}>
                          <img src={profile?.image || defaultProfile.image} className="w-full h-full object-cover rounded shadow-inner" />
                      </div>
                      <div className="absolute -bottom-2 right-2 z-20 bg-[#171d25] p-2 rounded-full"><StatusIcon status={profile?.status} size={28}/></div>
                      
                      {/* BÜYÜK AVATAR İÇİN GÖMÜLÜ HOVER KARTI */}
                      <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-80 bg-gradient-to-b from-[#3a444e] to-[#24282f] border border-[#4a5462] rounded shadow-2xl z-[300] cursor-default pt-2">
                          <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                          <div className="p-4 flex gap-4">
                              <div className="relative shrink-0">
                                  <img src={profile?.image || defaultProfile.image} className={`w-16 h-16 rounded object-cover bg-[#171d25] ${getFrameCSS(profile.avatarFrame)}`} />
                              </div>
                              <div className="flex flex-col justify-center">
                                  <div className="text-white font-bold text-lg leading-tight">{profile.name}</div>
                                  <div className="text-[#53a4c4] text-xs font-medium mt-0.5">
                                      {activeTab === 'library' && selectedLibGame ? `Şu Anda İnceliyor: ${selectedLibGame.title}` : 'Şu Anda Çevrimiçi'}
                                  </div>
                              </div>
                          </div>
                          <div className="bg-[#1e2024] p-3 border-t border-black/30 flex justify-between items-center rounded-b">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#aa7d1b] rounded-full flex items-center justify-center border border-black shadow-inner">
                                      <span className="text-white font-bold text-xs">{profile.level}</span>
                                  </div>
                                  <div>
                                      <div className="text-[#dcdedf] text-xs font-bold">Kayıtlı Oyunlar</div>
                                      <div className="text-[#8f98a0] text-[10px]">{libraryGames.length} Oyun</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col pt-4">
                      <h1 className="text-5xl font-black text-white mb-2 flex items-center gap-4 tracking-tight">
                          {profile?.name} 
                          <span className="text-xl font-black text-[#1a9fff] border-2 border-[#1a9fff] w-12 h-12 flex items-center justify-center rounded-full bg-[#101216] shadow-[0_0_15px_rgba(26,159,255,0.4)] ml-2">{profile?.level}</span>
                          <img src={`https://community.cloudflare.steamstatic.com/public/images/countryflags/${(profile?.countryCode || 'tr').toLowerCase()}.gif`} onError={(e) => e.target.style.display='none'} className="w-8 h-5 shadow-sm ml-1"/>
                      </h1>
                      <div className="text-[15px] text-[#8f98a0] mb-6 font-medium flex gap-3">
                          <span className="text-white">{profile.realName}</span>
                          <span className="text-[#66c0f4]">{profile.country}</span>
                      </div>
                      <p className="text-[#dcdedf] text-base mb-8 max-w-2xl leading-relaxed italic border-l-4 border-[#1a9fff] pl-5 py-2 bg-gradient-to-r from-black/30 to-transparent rounded-r">"{profile?.bio}"</p>
                      
                      <div className="mt-auto flex gap-8 text-base">
                          <div className="bg-[#101216]/80 px-6 py-3 rounded-lg border border-[#2a475e]/50 flex items-center gap-3 shadow-inner"><Activity size={20} className="text-[#1a9fff]"/> <span className="text-gray-400 font-medium">Süre:</span> <span className="font-bold text-white">{getFormatTime(appUsageSeconds)}</span></div>
                          <div className="bg-[#101216]/80 px-6 py-3 rounded-lg border border-[#2a475e]/50 flex items-center gap-3 shadow-inner"><Gamepad2 size={20} className="text-[#1a9fff]"/> <span className="text-gray-400 font-medium">Oyunlar:</span> <span className="font-bold text-white">{libraryGames.length}</span></div>
                      </div>
                  </div>
              </div>

              <div className="flex gap-10">
                  <div className="flex-[2] space-y-10">
                      
                      {favoriteGames.length > 0 && (
                          <div className="bg-[#1b2838]/60 backdrop-blur-sm p-8 rounded-xl border border-[#2a475e]/40 shadow-xl">
                              <h2 className="text-[#dcdedf] text-lg font-normal uppercase tracking-widest border-b border-[#2a475e] pb-3 mb-6 flex items-center gap-3"><Star size={20} className="text-yellow-500"/> Favori Oyun Vitrini</h2>
                              <div className="grid grid-cols-2 gap-5">
                                  {favoriteGames.map(id => {
                                      const g = libraryGames.find(x => x.id === id);
                                      if(!g) return null;
                                      return (
                                          <div key={id} onClick={() => navigateToLibraryGame(g.id)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg border border-[#2a2c31] hover:border-[#66c0f4] transition duration-300 h-32">
                                              <img src={g.header || g.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" title={g.title}/>
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                                                  <span className="text-white font-bold truncate text-lg drop-shadow-md">{g.title}</span>
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}

                      <div>
                          <div className="flex justify-between items-end border-b border-[#2a475e]/50 pb-3 mb-6">
                              <h2 className="text-[#dcdedf] font-normal text-2xl">Son Etkinlikler</h2>
                              <span className="text-[#8f98a0] text-sm font-medium">son 2 haftada {getFormatTime(appUsageSeconds)}</span>
                          </div>
                          <div className="space-y-4">
                              {recentGames.length === 0 ? <div className="text-gray-500 text-sm bg-[#1b2838] p-4 rounded border border-[#2a475e]/30">Etkinlik yok.</div> : 
                               recentGames.map(game => (
                                   <div key={game.id} onClick={() => navigateToLibraryGame(game.id)} className="bg-[#161920]/80 backdrop-blur-sm border border-[#2a2c31] rounded-xl flex flex-col cursor-pointer hover:border-[#1a9fff]/50 transition duration-300 overflow-hidden shadow-lg group">
                                       <div className="flex gap-6 p-6 items-center">
                                           <img src={game.header} className="w-56 rounded-lg shadow-md border border-black/50 group-hover:brightness-110 transition" />
                                           <div className="flex-1 flex justify-between items-center">
                                               <div className="text-white font-bold text-2xl group-hover:text-[#66c0f4] transition">{game.title}</div>
                                               <div className="text-right text-xs text-[#8f98a0] font-medium space-y-1">
                                                   <div>Kayıtlarda <span className="text-[#dcdedf]">{formatPlayTime(game.playtime)}</span></div>
                                                   <div>Son oynanma: <span className="text-[#dcdedf]">{formatLastPlayed(game.lastPlayed)}</span></div>
                                               </div>
                                           </div>
                                       </div>
                                       <div className="bg-[#101216]/90 p-4 flex items-center justify-between border-t border-[#2a2c31]">
                                           <div className="text-[12px] font-bold text-[#8f98a0] flex items-center gap-6 w-full px-2">
                                               <span className="uppercase tracking-wide">Başarım İlerlemesi</span>
                                               <div className="flex-1 flex items-center gap-3">
                                                   <span className="text-[#dcdedf] text-sm">{getSimulatedAchievements(game.id).current} / {getSimulatedAchievements(game.id).total}</span>
                                                   <div className="flex-1 h-2.5 bg-black rounded-full border border-[#2a2c31] overflow-hidden"><div className="h-full bg-gradient-to-r from-[#1a9fff] to-[#53a4c4]" style={{width: `${getSimulatedAchievements(game.id).percentage}%`}}></div></div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               ))}
                          </div>
                      </div>

                      <div className="bg-[#1b2838]/60 backdrop-blur-sm p-8 rounded-xl border border-[#2a475e]/40 shadow-xl">
                          <div className="flex justify-between items-center border-b border-[#2a475e] pb-4 mb-6">
                              <h2 className="text-[#dcdedf] text-xl font-normal flex items-center gap-3"><ImageIcon size={24} className="text-[#66c0f4]"/> Ekran Görüntüleri</h2>
                              <button onClick={() => screenInputRef.current.click()} className="text-sm bg-gradient-to-r from-[#2a475e] to-[#1b2838] hover:from-[#1a9fff] hover:to-[#53a4c4] text-white px-5 py-2 rounded-lg transition font-bold shadow border border-[#3e4552] hover:border-transparent flex items-center gap-2"><Plus size={16}/> Görsel Ekle</button>
                          </div>
                          
                          {screenshots.length === 0 ? (
                              <div className="text-gray-500 text-base text-center py-12 bg-black/20 rounded-lg border border-white/5 border-dashed">Kendi ekran görüntülerini yükleyerek profilini özelleştir.</div>
                          ) : (
                              <div className="flex flex-col gap-4">
                                  {screenshots.map((s,i) => (
                                      <div key={i} className="relative group cursor-pointer w-full">
                                          <img src={s} className="w-full h-auto object-contain rounded-lg border-2 border-[#2a475e] group-hover:border-[#66c0f4] transition duration-300 shadow-xl opacity-90 group-hover:opacity-100" />
                                          <button onClick={(e) => {e.stopPropagation(); removeScreenshot(i);}} className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow"><X size={18}/></button>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>

                      <div className="bg-[#1b2838]/60 backdrop-blur-sm p-8 rounded-xl border border-[#2a475e]/40 shadow-xl">
                          <h2 className="text-[#dcdedf] text-xl font-normal border-b border-[#2a475e] pb-4 mb-6 flex items-center gap-3"><MessageSquare size={24} className="text-[#66c0f4]"/> Yorumlar</h2>
                          <div className="flex gap-4 mb-8">
                              <img src={profile.image} className="w-12 h-12 rounded border border-[#2a475e] object-cover" />
                              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={addComment} placeholder="Profiline yorum bırak..." className="flex-1 bg-[#101216] border border-[#2a475e] p-4 rounded-lg text-sm text-white focus:border-[#1a9fff] outline-none shadow-inner" />
                          </div>
                          <div className="space-y-4">
                              {profileComments.map((c) => (
                                  <div key={c.id || c.date} className="flex gap-5 items-start bg-[#101216]/80 p-5 rounded-lg border border-[#2a475e]/30 hover:border-[#2a475e] transition group">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user}`} className="w-12 h-12 rounded border border-[#2a475e]" />
                                      <div className="flex-1 relative">
                                          <div className="flex items-center gap-3 mb-2">
                                              <span className="text-[15px] font-bold text-[#66c0f4] cursor-pointer hover:underline">{c.user}</span>
                                              <span className="text-[11px] text-[#556772] font-medium">{c.date}</span>
                                          </div>
                                          <div className="text-[14px] text-[#acb2b8] leading-relaxed pr-8">{c.text}</div>
                                          {c.user !== "Sistem" && (
                                              <button onClick={() => deleteComment(c.id)} className="absolute top-0 right-0 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><X size={16}/></button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 space-y-6">
                      <div className="bg-[#1b2838]/60 backdrop-blur-sm p-8 rounded-xl border border-[#2a475e]/40 shadow-xl">
                          <h2 className="text-white border-b border-[#2a475e] pb-3 mb-6 font-normal text-lg flex items-center gap-2"><Shield size={20} className="text-[#8f98a0]"/> Sistem Profili</h2>
                          <div className="space-y-5 text-sm text-[#8f98a0]">
                              <div className="bg-black/20 p-3 rounded border border-white/5"><div className="text-[10px] uppercase font-bold text-[#556772] mb-1">İşletim Sistemi</div><div className="text-[#dcdedf] font-medium">{systemSpecs?.os}</div></div>
                              <div className="bg-black/20 p-3 rounded border border-white/5"><div className="text-[10px] uppercase font-bold text-[#556772] mb-1">Ekran Kartı</div><div className="text-[#1a9fff] font-bold truncate" title={systemSpecs?.gpu}>{systemSpecs?.gpu}</div></div>
                              <div className="bg-black/20 p-3 rounded border border-white/5"><div className="text-[10px] uppercase font-bold text-[#556772] mb-1">İşlemci</div><div className="text-[#1a9fff] font-bold truncate" title={systemSpecs?.cpu}>{systemSpecs?.cpu}</div></div>
                              <div className="bg-black/20 p-3 rounded border border-white/5"><div className="text-[10px] uppercase font-bold text-[#556772] mb-1">RAM</div><div className="text-white font-bold">{systemSpecs?.ram}</div></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <input type="file" ref={screenInputRef} onChange={handleScreenshotUpload} className="hidden" accept="image/*" />
      </div>
  );

  return (
    <div className="h-screen bg-[#171d25] text-[#c6d4df] flex flex-col font-sans select-none overflow-hidden border border-[#3d4450]">
      <div className="h-8 flex justify-between items-center px-4 bg-[#171d25] drag-region shrink-0 z-[100] border-b border-black/30">
        <div className="text-[10px] text-gray-500 font-bold tracking-widest flex items-center gap-2 uppercase">SR PLATFORM <span className="bg-[#1a9fff] text-white text-[8px] px-1 rounded-sm">V3.1 Global</span></div>
        <div className="flex no-drag h-full items-center">
          <button onClick={() => window.electron.minimize()} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white"><Minus size={14}/></button>
          <button onClick={() => window.electron.maximize()} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white"><Square size={12}/></button>
          <button onClick={() => window.electron.close()} className="p-2 hover:bg-red-500 text-gray-400 hover:text-white"><X size={14}/></button>
        </div>
      </div>

      <div className="px-6 py-4 bg-[#171d25] flex justify-between items-center shrink-0 z-50 drag-region relative shadow-xl">
         <div className="flex items-center gap-8 no-drag">
            {viewingGame && activeTab === 'store' && (
                <button onClick={() => setViewingGame(null)} className="p-2 bg-[#2a475e] text-white rounded-full hover:bg-[#1a9fff] transition"><ArrowLeft size={16}/></button>
            )}
            <div className="flex flex-col cursor-pointer" onClick={() => {setActiveTab('store'); setViewingGame(null); setStoreSubTab('home');}}>
                <h1 className="text-[28px] font-black italic text-white tracking-tighter leading-none">STEAM</h1>
                <span className="text-[10px] text-[#1a9fff] font-bold tracking-widest uppercase mt-0.5">SR • Ultimate Edition</span>
            </div>
            <nav className="flex gap-6 text-base font-bold text-[#b8b6b4] uppercase tracking-wide ml-4">
               <button onClick={() => {setActiveTab('store'); setViewingGame(null);}} className={`hover:text-white transition ${activeTab==='store'?'text-[#1a9fff]':''}`}>MAĞAZA</button>
               <button onClick={() => setActiveTab('library')} className={`hover:text-white transition ${activeTab==='library'?'text-[#1a9fff]':''}`}>KÜTÜPHANE</button>
               <button onClick={() => setActiveTab('community')} className={`hover:text-white transition ${activeTab==='community'?'text-[#1a9fff]':''}`}>TOPLULUK</button>
               <button onClick={() => setActiveTab('profile')} className={`hover:text-white transition ${activeTab==='profile'?'text-[#1a9fff] border-b-2 border-[#1a9fff] pb-1':''}`}>{profile?.name}</button>
            </nav>
         </div>
         
         <div className="flex items-center gap-6 no-drag relative">
             <div className="relative group z-[300]">
                 <div className="relative">
                     <input type="text" value={searchQuery} onChange={handleSearchChange} onKeyDown={handleGlobalSearchSubmit} placeholder="Mağazada ara..." className="bg-[#101216] border border-[#3e4552] text-white px-4 py-1.5 pl-10 rounded-full text-sm w-64 outline-none focus:border-[#1a9fff] transition" />
                     <Search size={16} className="absolute left-3 top-2 text-gray-500 group-focus-within:text-[#1a9fff]"/>
                     {isSearching && <div className="absolute right-4 top-2.5 w-3 h-3 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>}
                 </div>
                 
                 {searchResults.length > 0 && searchQuery.length > 2 && (
                     <div className="absolute top-full mt-2 w-80 bg-[#1b2838] border border-[#2a475e] rounded-lg shadow-2xl overflow-hidden right-0">
                         <div className="text-[10px] font-bold text-[#8f98a0] p-2 bg-[#10141b] border-b border-[#2a475e]/50 uppercase">Sonuçlar</div>
                         {searchResults.slice(0, 5).map(g => (
                             <div key={g.id} onClick={() => { handleStoreGameClick(g.id); setSearchResults([]); setSearchQuery(""); }} className="flex gap-3 p-3 hover:bg-[#2a475e] cursor-pointer border-b border-white/5 transition">
                                 <img src={g.tiny_image} className="w-20 object-cover rounded shadow-sm" />
                                 <div className="flex flex-col justify-center">
                                     <div className="text-white text-[13px] font-bold line-clamp-1">{g.name}</div>
                                     <div className="text-[#1a9fff] text-xs font-bold mt-1">{g.price ? (g.price.final/100)+" TL" : "Ücretsiz"}</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>

             {/* MİNİ AVATAR İÇİN GÖMÜLÜ HOVER KARTI */}
             <div className="relative z-[200] group py-2">
                 <div className="relative cursor-pointer" onClick={() => setActiveTab('profile')}>
                     <img src={profile?.image || defaultProfile.image} className={`w-10 h-10 rounded-sm object-cover bg-[#171d25] ${getFrameCSS(profile.avatarFrame)}`} />
                     <div className="absolute -bottom-1 -right-1 bg-[#171d25] p-0.5 rounded-full"><StatusIcon status={profile?.status} size={12}/></div>
                 </div>
                 <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-80 bg-gradient-to-b from-[#3a444e] to-[#24282f] border border-[#4a5462] rounded shadow-2xl z-[300] cursor-default pt-2">
                     <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                     <div className="p-4 flex gap-4">
                         <div className="relative shrink-0">
                             <img src={profile?.image || defaultProfile.image} className={`w-16 h-16 rounded object-cover bg-[#171d25] ${getFrameCSS(profile.avatarFrame)}`} />
                         </div>
                         <div className="flex flex-col justify-center">
                             <div className="text-white font-bold text-lg leading-tight">{profile.name}</div>
                             <div className="text-[#53a4c4] text-xs font-medium mt-0.5">
                                 {activeTab === 'library' && selectedLibGame ? `Şu Anda İnceliyor: ${selectedLibGame.title}` : 'Şu Anda Çevrimiçi'}
                             </div>
                         </div>
                     </div>
                     <div className="bg-[#1e2024] p-3 border-t border-black/30 flex justify-between items-center rounded-b">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#aa7d1b] rounded-full flex items-center justify-center border border-black shadow-inner">
                                 <span className="text-white font-bold text-xs">{profile.level}</span>
                             </div>
                             <div>
                                 <div className="text-[#dcdedf] text-xs font-bold">Kayıtlı Oyunlar</div>
                                 <div className="text-[#8f98a0] text-[10px]">{libraryGames.length} Oyun</div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      <main className="flex-1 overflow-hidden bg-[#1b2838] relative flex flex-col z-0">
          {activeTab === 'store' && renderStore()}
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'community' && renderCommunity()}
          {activeTab === 'profile' && renderProfile()}
      </main>

      {/* PROFİL DÜZENLEME MODALI */}
      {isEditingProfile && (
         <div className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="bg-[#1b2838] p-8 rounded shadow-[0_0_50px_rgba(26,159,255,0.2)] relative border border-[#1a9fff] w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
               <h2 className="text-white font-normal mb-6 flex items-center gap-2 text-xl"><Settings size={20}/> Profili Düzenle</h2>
               
               <div className="flex gap-6 mb-6 pb-6 border-b border-[#2a475e]">
                  <div className="flex flex-col items-center">
                      <div className="relative group cursor-pointer w-24 h-24 mb-2" onClick={() => fileInputRef.current.click()}>
                         <img src={profile?.image || defaultProfile.image} className={`w-full h-full rounded object-cover group-hover:opacity-50 transition bg-[#171d25] ${getFrameCSS(profile.avatarFrame)}`} />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={24} className="text-white"/></div>
                      </div>
                  </div>
                  <div className="flex-1 space-y-3">
                      <div><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Kullanıcı Adı</label><input value={profile?.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm" /></div>
                      <div className="flex gap-2">
                          <div className="flex-[2]"><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Ülke</label><input value={profile?.country || ""} onChange={e => setProfile({...profile, country: e.target.value})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm" /></div>
                          <div className="flex-1"><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Kod</label><input value={profile?.countryCode || ""} onChange={e => setProfile({...profile, countryCode: e.target.value})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm uppercase" maxLength={2} placeholder="TR"/></div>
                      </div>
                  </div>
               </div>

               <div className="space-y-4 mb-6 pb-6 border-b border-[#2a475e]">
                  <div><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Hakkında (Bio)</label><textarea rows={3} value={profile?.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm custom-scrollbar resize-none" /></div>
                  <div className="flex gap-4">
                      <div className="flex-[2]"><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Gerçek İsim / Nickname</label><input value={profile?.realName || ""} onChange={e => setProfile({...profile, realName: e.target.value})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm" /></div>
                      <div className="flex-1"><label className="text-[10px] font-bold text-[#8f98a0] uppercase">Profil Seviyesi</label><input type="number" value={profile?.level || 0} onChange={e => setProfile({...profile, level: parseInt(e.target.value) || 0})} className="w-full bg-[#101216] p-2 rounded text-white border border-transparent outline-none focus:border-[#1a9fff] mt-1 text-sm" /></div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#101216] p-3 rounded border border-[#2a475e]">
                      <div>
                          <label className="text-[10px] font-bold text-[#8f98a0] uppercase block">Arkaplan (Fotoğraf/Video)</label>
                          <div className="text-xs text-gray-500 mt-1">{profile.profileBg ? "Kişisel arkaplan aktif." : "Varsayılan."}</div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => bgInputRef.current.click()} className="text-xs bg-[#2a475e] hover:bg-[#1a9fff] hover:text-black text-white px-3 py-1.5 rounded transition">Yükle</button>
                          {profile.profileBg && <button onClick={() => setProfile({...profile, profileBg: null, isBgVideo: false})} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded transition">Kaldır</button>}
                      </div>
                  </div>

                  <div className="bg-[#101216] p-3 rounded border border-[#2a475e]">
                      <label className="text-[10px] font-bold text-[#8f98a0] uppercase flex justify-between">
                          <span>Arkaplan Şeffaflığı</span>
                          <span className="text-[#1a9fff]">% {Math.round(profile.profileBgOpacity * 100)}</span>
                      </label>
                      <input type="range" min="0.05" max="1" step="0.05" value={profile.profileBgOpacity} onChange={e => setProfile({...profile, profileBgOpacity: parseFloat(e.target.value)})} className="w-full mt-2 accent-[#1a9fff]" />
                  </div>

                  <div className="flex items-center justify-between bg-[#101216] p-3 rounded border border-[#2a475e]">
                      <label className="text-[10px] font-bold text-[#8f98a0] uppercase block">Mini Avatar Çerçevesi</label>
                      <select value={profile?.avatarFrame || "none"} onChange={e => setProfile({...profile, avatarFrame: e.target.value})} className="bg-[#1b2838] border border-[#2a475e] p-1.5 rounded text-white outline-none focus:border-[#1a9fff] text-xs cursor-pointer">
                          <option value="none">Sade (İnce Mavi)</option>
                          <option value="neon">Siber Neon</option>
                          <option value="gold">Saf Altın</option>
                          <option value="dragon">Ejder Ateşi</option>
                      </select>
                  </div>

                  <div><label className="text-[10px] font-bold text-[#8f98a0] uppercase mt-2 block">Durum Göstergesi</label>
                      <div className="flex gap-4 mt-2">
                          {['online', 'idle', 'dnd', 'invisible'].map(s => (
                              <div key={s} onClick={() => setProfile({...profile, status: s})} className={`cursor-pointer p-3 rounded transition flex items-center justify-center ${profile?.status === s ? 'bg-[#2a475e] shadow-inner' : 'bg-[#101216] hover:bg-[#1b2838]'}`}><StatusIcon status={s} size={24}/></div>
                          ))}
                      </div>
                  </div>
               </div>
               <div className="flex gap-3 mt-8">
                  <button onClick={saveProfile} className="flex-1 bg-gradient-to-r from-[#1a9fff] to-[#2a475e] text-white font-bold py-2.5 rounded shadow-lg hover:brightness-110 transition">Değişiklikleri Kaydet</button>
                  <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-[#3d4450] text-white font-bold py-2.5 rounded hover:bg-[#4b5463] transition">İptal Et</button>
               </div>
            </div>
         </div>
      )}
      
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*,.gif" />
      <input type="file" ref={bgInputRef} onChange={handleBgUpload} className="hidden" accept="image/*,video/mp4,video/webm,.gif" />
      <input type="file" ref={screenInputRef} onChange={handleScreenshotUpload} className="hidden" accept="image/*,.gif" />
    </div>
  );
}