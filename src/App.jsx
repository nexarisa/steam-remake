import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Minus, Square, X, Play, Settings, Edit3, Camera, Heart, Users, ArrowLeft, ShoppingCart, Info, Trophy, Activity, Shield, Star, Download, Gamepad2, Image as ImageIcon, MessageSquare, Plus, Send, Minimize2, Trash2, Globe, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('library'); 
  const [storeSubTab, setStoreSubTab] = useState('home'); 
  const [systemSpecs, setSystemSpecs] = useState(null);
  const [appUsageSeconds, setAppUsageSeconds] = useState(0);
  
  const [storeGames, setStoreGames] = useState([]);
  const [dlcGames, setDlcGames] = useState([]);
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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [aiFpsResult, setAiFpsResult] = useState("Analiz ediliyor...");
  const [fpsSource, setFpsSource] = useState("YEDEK MOTOR"); 

  // DİL VE AYARLAR SİSTEMİ (C2 SEVİYE)
  const [lang, setLang] = useState('tr');
  const dict = {
      tr: { store: 'MAĞAZA', library: 'KÜTÜPHANE', community: 'TOPLULUK', settings: 'AYARLAR', profile: 'PROFİL', search: 'Mağazada ara...', notifs: 'BİLDİRİMLER', clear: 'TEMİZLE', friends: 'ARKADAŞLAR', myId: 'Benim ID', addFriend: 'Arkadaş Ekle', typeId: 'ID Girin', browse: 'Göz Atın', dlcs: 'DLC & Eklentiler', searchRes: 'Arama Sonuçları', play: 'OYNA', install: 'YÜKLE', reqSpace: 'GEREKLİ ALAN', lastPlayed: 'SON OYNAMA', playtime: 'OYNAMA SÜRESİ', achievements: 'BAŞARIMLAR', about: 'OYUN HAKKINDA', lang: 'DİL SEÇİMİ', langDesc: 'Arayüz dilini değiştirin.' },
      en: { store: 'STORE', library: 'LIBRARY', community: 'COMMUNITY', settings: 'SETTINGS', profile: 'PROFILE', search: 'Search store...', notifs: 'NOTIFICATIONS', clear: 'CLEAR', friends: 'FRIENDS', myId: 'My ID', addFriend: 'Add Friend', typeId: 'Enter ID', browse: 'Browse', dlcs: 'DLC & Expansions', searchRes: 'Search Results', play: 'PLAY', install: 'INSTALL', reqSpace: 'REQUIRED SPACE', lastPlayed: 'LAST PLAYED', playtime: 'PLAYTIME', achievements: 'ACHIEVEMENTS', about: 'ABOUT THIS GAME', lang: 'LANGUAGE', langDesc: 'Change interface language.' },
      de: { store: 'SHOP', library: 'BIBLIOTHEK', community: 'COMMUNITY', settings: 'EINSTELLUNGEN', profile: 'PROFIL', search: 'Shop durchsuchen...', notifs: 'BENACHRICHTIGUNGEN', clear: 'LÖSCHEN', friends: 'FREUNDE', myId: 'Meine ID', addFriend: 'Freund Hinzufügen', typeId: 'ID Eingeben', browse: 'Durchsuchen', dlcs: 'DLC & Erweiterungen', searchRes: 'Suchergebnisse', play: 'SPIELEN', install: 'INSTALLIEREN', reqSpace: 'SPEICHERPLATZ', lastPlayed: 'ZULETZT GESPIELT', playtime: 'SPIELZEIT', achievements: 'ERRUNGENSCHAFTEN', about: 'ÜBER DIESES SPIEL', lang: 'SPRACHE', langDesc: 'Schnittstellensprache ändern.' },
      fr: { store: 'MAGASIN', library: 'BIBLIOTHÈQUE', community: 'COMMUNAUTÉ', settings: 'PARAMÈTRES', profile: 'PROFIL', search: 'Rechercher...', notifs: 'NOTIFICATIONS', clear: 'EFFACER', friends: 'AMIS', myId: 'Mon ID', addFriend: 'Ajouter Ami', typeId: 'Entrer ID', browse: 'Parcourir', dlcs: 'DLC & Extensions', searchRes: 'Résultats', play: 'JOUER', install: 'INSTALLER', reqSpace: 'ESPACE REQUIS', lastPlayed: 'DERNIÈRE PARTIE', playtime: 'TEMPS DE JEU', achievements: 'SUCCÈS', about: 'À PROPOS DU JEU', lang: 'LANGUE', langDesc: "Changer la langue de l'interface." },
      ru: { store: 'МАГАЗИН', library: 'БИБЛИОТЕКА', community: 'СООБЩЕСТВО', settings: 'НАСТРОЙКИ', profile: 'ПРОФИЛЬ', search: 'Поиск в магазине...', notifs: 'УВЕДОМЛЕНИЯ', clear: 'ОЧИСТИТЬ', friends: 'ДРУЗЬЯ', myId: 'Мой ID', addFriend: 'Добавить', typeId: 'Введите ID', browse: 'Обзор', dlcs: 'Дополнения (DLC)', searchRes: 'Результаты', play: 'ИГРАТЬ', install: 'УСТАНОВИТЬ', reqSpace: 'МЕСТО НА ДИСКЕ', lastPlayed: 'ПОСЛЕДНИЙ ЗАПУСК', playtime: 'ВРЕМЯ В ИГРЕ', achievements: 'ДОСТИЖЕНИЯ', about: 'ОБ ИГРЕ', lang: 'ЯЗЫК', langDesc: 'Изменить язык интерфейса.' },
      jp: { store: 'ストア', library: 'ライブラリ', community: 'コミュニティ', settings: '設定', profile: 'プロフィール', search: 'ストアを検索...', notifs: '通知', clear: 'クリア', friends: 'フレンド', myId: 'マイID', addFriend: 'フレンド追加', typeId: 'IDを入力', browse: '閲覧する', dlcs: 'DLCと拡張機能', searchRes: '検索結果', play: 'プレイ', install: 'インストール', reqSpace: '必要な容量', lastPlayed: '最終プレイ', playtime: 'プレイ時間', achievements: '実績', about: 'ゲームについて', lang: '言語', langDesc: 'インターフェース言語を変更します。' }
  };
  const t = (key) => dict[lang][key] || dict['tr'][key];

  // PNG BAYRAKLAR BURAYA EKLENDİ (EMOJİLER ÇÖPE GİTTİ)
  const languages = [
      { code: 'tr', name: 'Türkçe', short: 'TR', flagUrl: 'https://flagcdn.com/w40/tr.png' },
      { code: 'en', name: 'English', short: 'EN', flagUrl: 'https://flagcdn.com/w40/us.png' },
      { code: 'de', name: 'Deutsch', short: 'DE', flagUrl: 'https://flagcdn.com/w40/de.png' },
      { code: 'fr', name: 'Français', short: 'FR', flagUrl: 'https://flagcdn.com/w40/fr.png' },
      { code: 'ru', name: 'Русский', short: 'RU', flagUrl: 'https://flagcdn.com/w40/ru.png' },
      { code: 'jp', name: '日本語', short: 'JP', flagUrl: 'https://flagcdn.com/w40/jp.png' }
  ];

  // GERÇEK ARKADAŞLIK SİSTEMİ STATE'LERİ
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [addFriendInput, setAddFriendInput] = useState("");
  const chatScrollRef = useRef(null);

  const defaultProfile = { 
      name: "Furky", realName: "Furkan", bio: "SR Ultimate Developer - Pencereden baktığınızda güneşi esirgemiyorsa gökyüzü, birileri bedelini ödediği içindir.", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Furky", 
      status: "online", level: 99, country: "Turkey", countryCode: "tr",
      profileBg: null, isBgVideo: false, profileBgOpacity: 0.15, bgVolume: 0.0, avatarFrame: "neon"
  };
  
  const [profile, setProfile] = useState(defaultProfile);
  const myUserId = `SR-${profile.name.toUpperCase().substring(0,3)}-8492`; // KULLANICIYA ÖZEL ID

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileComments, setProfileComments] = useState([{id: 1, user: "Sistem", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=System", text: "SR Ultimate platformuna hoş geldin.", date: "Az önce"}]);
  const [newComment, setNewComment] = useState("");
  
  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const screenInputRef = useRef(null);
  const profileVideoRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
      if (profileVideoRef.current) {
          profileVideoRef.current.volume = profile.bgVolume || 0;
      }
  }, [profile.bgVolume, profile.profileBg, activeTab]);

  const slides = [
    { id: 1174180, title: "Red Dead Redemption 2", desc: "Amerika'nın acımasız kalbinde destansı bir hayat hikayesi.", price: "$19.99 USD", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/library_hero.jpg", tags: ["Açık Dünya", "Başyapıt", "Hikaye Zengin"] },
    { id: 1091500, title: "Cyberpunk 2077", desc: "Güç, gösteriş ve vücut modifikasyonuna takıntılı bir megalopoliste geçen aksiyon-macera RPG'si.", price: "$29.99 USD", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg", tags: ["RPG", "Bilim Kurgu", "Siberpunk"] },
    { id: 1593500, title: "God of War", desc: "Olimpos Tanrılarından aldığı intikamın üzerinden yıllar geçen Kratos, artık İskandinav Tanrılarının diyarında yaşıyor.", price: "$49.99 USD", img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1593500/library_hero.jpg", tags: ["Aksiyon", "Mitokojik", "Şaheser"] }
  ];

  const fallbackGames = [
      { id: 1174180, name: "Red Dead Redemption 2", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg", price_overview: { final_formatted: "19.99 USD" } },
      { id: 1091500, name: "Cyberpunk 2077", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg", price_overview: { final_formatted: "29.99 USD" } },
      { id: 1593500, name: "God of War", header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg", price_overview: { final_formatted: "49.99 USD" } }
  ];

  const formatToUSD = (priceData, rawPriceObj) => {
      if(!priceData && !rawPriceObj) return "Ücretsiz";
      let valStr = priceData || (rawPriceObj && rawPriceObj.final_formatted);
      if(!valStr) return "Ücretsiz";
      if(valStr.includes('$') || valStr.includes('USD')) return valStr;
      const numeric = parseInt(valStr.replace(/[^0-9]/g, ''));
      if(isNaN(numeric) || numeric === 0) return "Ücretsiz";
      const inUSD = (numeric / 100 / 35).toFixed(2); 
      return `$${inUSD} USD`;
  };

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
    loadData('sr_comments_v8', setProfileComments, [{id: 1, user: "Sistem", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=System", text: "SR Ultimate sistemine hoş geldiniz.", date: "Bugün"}]);
    loadData('sr_notifs_v8', setNotifications, []);
    loadData('sr_chats_v8', setChatMessages, {});
    loadData('sr_lang_v8', setLang, 'tr');

    const storedFriends = localStorage.getItem('sr_friends_v8');
    if (storedFriends) {
        setFriendsList(JSON.parse(storedFriends));
    } else {
        const initialFriends = [
            { id: "SR-TEST-101", name: "Kral_TR", status: "in-game", game: "Counter-Strike 2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet" },
            { id: "SR-TEST-102", name: "GamerGirl99", status: "online", game: null, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse" }
        ];
        setFriendsList(initialFriends);
        localStorage.setItem('sr_friends_v8', JSON.stringify(initialFriends));
    }
    
    const savedUsage = localStorage.getItem('sr_usage_v8');
    if (savedUsage) setAppUsageSeconds(parseInt(savedUsage) || 0);

    if (window.electron) {
      window.electron.getSystemSpecs().then(specs => setSystemSpecs(specs));
      
      const fetchAAA = async () => {
          try {
              const keywords = ["Grand Theft Auto", "Cyberpunk", "Red Dead", "God of War", "The Witcher"];
              let allGames = [];
              for (const k of keywords) {
                  const res = await window.electron.searchSteam(k);
                  if (res && Array.isArray(res)) allGames = [...allGames, ...res];
              }
              const unique = Array.from(new Map(allGames.map(item => [item.id, item])).values());
              const cleanAAA = unique.filter(g => 
                  !g.name.toLowerCase().includes('dlc') && 
                  !g.name.toLowerCase().includes('pack') &&
                  !g.name.toLowerCase().includes('soundtrack') &&
                  !g.name.toLowerCase().includes('expansion')
              );
              setStoreGames(cleanAAA.length > 0 ? cleanAAA : fallbackGames);
          } catch(e) { setStoreGames(fallbackGames); }
      };
      
      const fetchDLCs = async () => {
          try {
              const res = await window.electron.searchSteam("DLC");
              if (res && Array.isArray(res)) setDlcGames(res);
          } catch(e) { setDlcGames([]); }
      };

      fetchAAA();
      fetchDLCs();
      
      window.electron.getInstalledGames().then(async (games) => {
          if(!games) return;
          const cleanedGames = games.filter(g => 
              !g.title.toLowerCase().includes('steamworks') && 
              !g.title.toLowerCase().includes('proton') &&
              !g.title.toLowerCase().includes('redistributables') &&
              !g.title.toLowerCase().includes('dedicated server')
          );
          
          setLibraryGames(cleanedGames);
          if(cleanedGames.length > 0) handleLibraryGameClick(cleanedGames[0]);

          const resolveNames = async () => {
              let updatedGames = [...cleanedGames];
              for(let i=0; i<updatedGames.length; i++) {
                  if (updatedGames[i].title.includes("Steam ID:")) {
                      try {
                          const details = await window.electron.getGameDetails(updatedGames[i].id);
                          if (details && details.name) {
                              updatedGames[i].title = details.name;
                              setLibraryGames([...updatedGames]); 
                          }
                          await new Promise(r => setTimeout(r, 200)); 
                      } catch(e) {}
                  }
              }
          };
          resolveNames();
      });
    }
    return () => { clearInterval(slideInterval); clearInterval(usageInterval); };
  }, []);

  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatMessages, activeChatUser]);

  const changeLanguage = (code) => {
      setLang(code);
      localStorage.setItem('sr_lang_v8', code);
  };

  const triggerNotification = (title, desc) => {
      const newNotif = { id: Date.now(), title, desc, read: false, time: new Date().toLocaleTimeString().slice(0,5) };
      const updated = [newNotif, ...notifications].slice(0, 10);
      setNotifications(updated);
      localStorage.setItem('sr_notifs_v8', JSON.stringify(updated));
  };

  const markNotifsAsRead = () => {
      const updated = notifications.map(n => ({...n, read: true}));
      setNotifications(updated);
      localStorage.setItem('sr_notifs_v8', JSON.stringify(updated));
  };

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
          if(res && Array.isArray(res)) {
              setStoreGames(res.filter(g => !g.name.toLowerCase().includes('dlc')));
          }
      }
  };

  const handleStoreGameClick = async (appId) => {
      setSearchQuery(""); setSearchResults([]); 
      setActiveTab('store');
      const details = await window.electron.getGameDetails(appId);
      if(details) {
          setViewingGame(details);
          if(details.movies && details.movies.length > 0) setActiveMedia({ type: 'video', url: details.movies[0].mp4?.max || details.movies[0].webm?.max });
          else if(details.screenshots && details.screenshots.length > 0) setActiveMedia({ type: 'image', url: details.screenshots[0].path_full });
          else setActiveMedia(null);
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
      } else {
          updated.push({ id: gameDetails.steam_appid, name: gameDetails.name, img: gameDetails.header_image, price: formatToUSD(gameDetails.price_overview?.final_formatted, gameDetails.price_overview) });
          triggerNotification("İstek Listesi Güncellendi", `${gameDetails.name} başarıyla listene eklendi.`);
      }
      setWishlist(updated);
      localStorage.setItem('sr_wishlist_v8', JSON.stringify(updated));
  };

  const addComment = (e) => {
      if(e.key === 'Enter' && newComment.trim() !== "") {
          const updated = [{id: Date.now(), user: profile.name, image: profile.image, text: newComment, date: new Date().toLocaleDateString('tr-TR')}, ...profileComments];
          setProfileComments(updated);
          localStorage.setItem('sr_comments_v8', JSON.stringify(updated));
          setNewComment("");
          triggerNotification("Yeni Yorum", "Profiline yeni bir yorum bırakıldı.");
      }
  };

  const deleteComment = (id) => {
      const updated = profileComments.filter(c => c.id !== id && c.user !== "Sistem"); 
      setProfileComments(updated);
      localStorage.setItem('sr_comments_v8', JSON.stringify(updated));
  };

  const removeScreenshot = (index) => {
      setScreenshots(prev => {
          const updated = prev.filter((_, i) => i !== index);
          localStorage.setItem('sr_screens_v8', JSON.stringify(updated));
          return updated;
      });
  };

  const saveProfile = () => { localStorage.setItem('sr_profile_v8', JSON.stringify(profile)); setIsEditingProfile(false); };
  
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

  const calculateFallbackFPS = (gpuInfo, game) => {
      if(!gpuInfo || !game) return "Analiz ediliyor...";
      const gpu = gpuInfo.toLowerCase() || "";
      let base = 75; 
      if(gpu.includes('5090')) base = 350;
      else if(gpu.includes('4090') || gpu.includes('5080')) base = 250;
      else if(gpu.includes('4080') || gpu.includes('5070')) base = 180; 
      else if(gpu.includes('4070') || gpu.includes('3080') || gpu.includes('4060 ti')) base = 120;
      else if(gpu.includes('4060') || gpu.includes('3060')) base = 85;
      else if(gpu.includes('1650') || gpu.includes('1060')) base = 45;

      const hash = game.id.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const uniqueMod = (hash % 10) - 5; 

      let multiplier = 1.0;
      const title = game.title?.toLowerCase() || "";
      
      if(title.includes('cyberpunk') || title.includes('ark') || title.includes('alan wake')) multiplier = 0.45; 
      else if(title.includes('red dead') || title.includes('god of war') || title.includes('squad') || title.includes('rust')) multiplier = 0.65; 
      else if(title.includes('witcher') || title.includes('gta') || title.includes('forza')) multiplier = 0.95; 
      else if(title.includes('cs') || title.includes('counter') || title.includes('valorant') || title.includes('league')) multiplier = 3.5; 
      else if(title.includes('stardew') || title.includes('hollow') || title.includes('terraria')) multiplier = 5.0; 

      const finalFps = Math.floor((base * multiplier) + uniqueMod);
      return `${finalFps > 10 ? finalFps : 15} FPS`;
  };

  useEffect(() => {
      let isMounted = true;
      const fetchAIFps = async () => {
          if (!systemSpecs || !systemSpecs.gpu || !selectedLibGame) {
              if (isMounted) setAiFpsResult("Analiz ediliyor...");
              return;
          }
          if (isMounted) setAiFpsResult("Hesaplanıyor...");
          try {
              if (!window.electron.getAiFps) throw new Error("API Yok");
              const result = await window.electron.getAiFps(systemSpecs.gpu, selectedLibGame.title);
              if (isMounted) {
                  setAiFpsResult(result);
                  setFpsSource("AI MOTORU");
              }
          } catch (error) {
              if (isMounted) {
                  const fallback = calculateFallbackFPS(systemSpecs.gpu, selectedLibGame);
                  setAiFpsResult(fallback);
                  setFpsSource("YEDEK MOTOR");
              }
          }
      };
      fetchAIFps();
      return () => { isMounted = false; };
  }, [selectedLibGame, systemSpecs]);

  const handleAddFriend = () => {
      if(!addFriendInput.trim()) return;
      if(addFriendInput === myUserId) {
          triggerNotification("Hata", "Kendi kendini ekleyemezsin kanka.");
          return;
      }
      if(friendsList.find(f => f.id === addFriendInput)) {
          triggerNotification("Hata", "Bu kişi zaten listende ekli.");
          return;
      }
      
      const newFriend = {
          id: addFriendInput,
          name: `User_${addFriendInput.substring(0,4)}`,
          status: Math.random() > 0.5 ? "online" : "offline",
          game: null,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${addFriendInput}`
      };
      
      const updated = [...friendsList, newFriend];
      setFriendsList(updated);
      localStorage.setItem('sr_friends_v8', JSON.stringify(updated));
      setAddFriendInput("");
      triggerNotification("Başarılı", "Arkadaş eklendi.");
  };

  const handleRemoveFriend = (id, e) => {
      e.stopPropagation();
      const updated = friendsList.filter(f => f.id !== id);
      setFriendsList(updated);
      localStorage.setItem('sr_friends_v8', JSON.stringify(updated));
      if(activeChatUser && activeChatUser.id === id) setActiveChatUser(null);
  };

  const handleSendMessage = () => {
      if(!chatInput.trim() || !activeChatUser) return;
      const fId = activeChatUser.id;
      const newMsg = { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString().slice(0,5) };
      
      const userMsgs = chatMessages[fId] || [];
      const updatedMsgs = [...userMsgs, newMsg];
      
      setChatMessages(prev => {
          const newState = {...prev, [fId]: updatedMsgs};
          localStorage.setItem('sr_chats_v8', JSON.stringify(newState));
          return newState;
      });
      setChatInput("");

      setTimeout(() => {
          const botReply = { sender: 'them', text: "Aynen kanka, maça giricem birazdan bekle beni.", time: new Date().toLocaleTimeString().slice(0,5) };
          setChatMessages(prev => {
              const current = prev[fId] || [];
              const newState = {...prev, [fId]: [...current, botReply]};
              localStorage.setItem('sr_chats_v8', JSON.stringify(newState));
              return newState;
          });
          if (!isFriendsOpen) triggerNotification(`Yeni Mesaj: ${activeChatUser.name}`, "Aynen kanka, maça giricem...");
      }, 1500);
  };

  const FriendStatusIcon = ({ status, size=10 }) => {
      const s = `${size}px`;
      if(status === 'in-game') return <div style={{width: s, height: s}} className="rounded-full bg-[#90ba3c] shadow-[0_0_8px_#90ba3c]"></div>;
      if(status === 'online') return <div style={{width: s, height: s}} className="rounded-full bg-[#53a4c4] shadow-[0_0_8px_#53a4c4]"></div>;
      if(status === 'dnd') return <div style={{width: s, height: s}} className="rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>;
      return <div style={{width: s, height: s}} className="rounded-full bg-[#80848e] border border-white/20"></div>;
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
    }
  };

  const searchTextSafe = (libSearchText || "").toLowerCase();
  let processedLibraryGames = libraryGames.filter(g => (g.title || "").toLowerCase().includes(searchTextSafe));
  if (libSortType === 'alpha') processedLibraryGames.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  else if (libSortType === 'playtime') processedLibraryGames.sort((a, b) => (b.playtime || 0) - (a.playtime || 0));

  const favGamesList = processedLibraryGames.filter(g => favoriteGames.includes(g.id));
  const normalGamesList = processedLibraryGames.filter(g => !favoriteGames.includes(g.id));
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // AYARLAR SEKMESİ (BAYRAKLAR PNG OLARAK GÜNCELLENDİ)
  const renderSettings = () => (
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#171a21] animate-fade-in p-10">
          <div className="max-w-[800px] mx-auto">
              <h1 className="text-4xl font-black text-white mb-8 border-b border-[#2a475e] pb-4 flex items-center gap-4"><Settings size={36} className="text-[#1a9fff]"/> {t('settings')}</h1>
              
              <div className="bg-[#1b2838]/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/5 mb-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Globe size={24} className="text-[#1a9fff]"/> {t('lang')}</h2>
                  <p className="text-sm text-[#8f98a0] mb-6">{t('langDesc')}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                      {languages.map(l => (
                          <div key={l.code} onClick={() => changeLanguage(l.code)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${lang === l.code ? 'bg-[#1a9fff]/10 border-[#1a9fff] shadow-[0_0_15px_rgba(26,159,255,0.2)]' : 'bg-[#10141b] border-white/5 hover:border-white/20'}`}>
                              <div className="flex items-center gap-4">
                                  <img src={l.flagUrl} alt={l.code} className="w-8 h-auto rounded shadow-sm border border-white/10" />
                                  <span className={`font-bold ${lang === l.code ? 'text-white' : 'text-[#dcdedf]'}`}>{l.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-[#556772] bg-black/40 px-2 py-1 rounded">{l.short}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderStore = () => {
      if (viewingGame) {
          const highResBg = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${viewingGame.steam_appid}/library_hero.jpg`;
          return (
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0f16] animate-fade-in relative text-[#c6d4df]">
                  <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f16]/90 to-[#0a0f16] z-10"></div>
                      <img src={highResBg} onError={(e)=>{e.target.src=viewingGame.header_image}} className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
                  </div>
                  
                  <div className="sticky top-0 z-50 bg-[#0a0f16]/80 backdrop-blur-xl border-b border-white/5 px-10 py-4 flex items-center gap-6 text-sm font-bold shadow-lg">
                      <button onClick={() => {setViewingGame(null); setStoreSubTab('home');}} className="text-[#8f98a0] hover:text-white flex items-center gap-2 transition group"><ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Mağazaya Dön</button>
                      <div className="w-px h-4 bg-white/10"></div>
                      <span className="text-white drop-shadow-md">{viewingGame.name}</span>
                  </div>

                  <div className="max-w-[1300px] mx-auto p-10 relative z-10">
                      <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tight mb-10">{viewingGame.name}</h1>
                      
                      <div className="flex gap-10 mb-12 flex-col lg:flex-row">
                          <div className="flex-[7] flex flex-col gap-4">
                              <div className="w-full aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative group">
                                  {activeMedia?.type === 'video' ? (
                                      <video key={activeMedia.url} autoPlay loop controls className="w-full h-full object-contain">
                                          <source src={activeMedia.url} type={activeMedia.url?.includes('.webm') ? 'video/webm' : 'video/mp4'} />
                                      </video>
                                  ) : <img src={activeMedia?.url || viewingGame.header_image} className="w-full h-full object-contain"/>}
                              </div>
                              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 snap-x">
                                  {viewingGame.movies?.map(m => (
                                      <div key={m.id} onClick={() => setActiveMedia({type: 'video', url: m.mp4?.max || m.webm?.max})} className={`relative w-40 aspect-video shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 snap-center transition-all duration-300 ${activeMedia?.url === (m.mp4?.max || m.webm?.max) ? 'border-[#1a9fff] scale-[1.03] shadow-[0_0_20px_rgba(26,159,255,0.4)]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'}`}>
                                          <img src={m.thumbnail} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition"><Play size={24} className="text-white drop-shadow-lg" fill="currentColor"/></div>
                                      </div>
                                  ))}
                                  {viewingGame.screenshots?.map(s => (
                                      <img key={s.id} onClick={() => setActiveMedia({type: 'image', url: s.path_full})} src={s.path_thumbnail} className={`w-40 aspect-video shrink-0 object-cover cursor-pointer rounded-xl border-2 snap-center transition-all duration-300 ${activeMedia?.url === s.path_full ? 'border-[#1a9fff] scale-[1.03] shadow-[0_0_20px_rgba(26,159,255,0.4)]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'}`}/>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="flex-[3] flex flex-col gap-6">
                              <div className="bg-[#10141b]/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/5">
                                 <img src={viewingGame.header_image} className="w-full rounded-xl mb-6 shadow-md" />
                                 <div className="text-[14px] text-[#acb2b8] leading-relaxed mb-8 line-clamp-6" dangerouslySetInnerHTML={{__html: viewingGame.short_description || "Açıklama bulunamadı."}}></div>
                                 
                                 <div className="space-y-4 text-xs mb-8 border-l-2 border-[#1a9fff] pl-4">
                                     <div className="flex"><span className="w-24 text-[#556772] font-bold uppercase">Çıkış:</span> <span className="text-white font-medium">{viewingGame.release_date?.date || "Bilinmiyor"}</span></div>
                                     <div className="flex"><span className="w-24 text-[#556772] font-bold uppercase">Geliştirici:</span> <span className="text-[#66c0f4] hover:text-white cursor-pointer transition font-medium">{viewingGame.developers?.[0] || "Bilinmiyor"}</span></div>
                                     <div className="flex"><span className="w-24 text-[#556772] font-bold uppercase">Yayıncı:</span> <span className="text-[#66c0f4] hover:text-white cursor-pointer transition font-medium">{viewingGame.publishers?.[0] || "Bilinmiyor"}</span></div>
                                 </div>

                                 <div className="flex flex-col gap-4 mt-auto">
                                    <div className="bg-black/50 border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-4">
                                        <div className="text-3xl font-black text-white tracking-tight">{formatToUSD(viewingGame.price_overview?.final_formatted, viewingGame.price_overview)}</div>
                                        <button className="w-full bg-gradient-to-r from-[#75b022] to-[#588a1b] text-white py-3.5 rounded-lg shadow-[0_10px_20px_rgba(117,176,34,0.2)] hover:brightness-125 transition-all font-bold flex items-center justify-center gap-2 transform hover:-translate-y-1"><ShoppingCart size={18}/> Sepete Ekle</button>
                                    </div>
                                    <button onClick={() => toggleWishlist(viewingGame)} className={`w-full py-3.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 border ${wishlist.find(g => g.id === viewingGame.steam_appid) ? 'bg-[#1a9fff]/10 border-[#1a9fff] text-[#1a9fff]' : 'bg-[#2a475e]/30 border-transparent text-[#dcdedf] hover:bg-[#2a475e]'}`}>
                                        <Heart size={16} className={wishlist.find(g => g.id === viewingGame.steam_appid) ? "fill-current" : ""}/> 
                                        {wishlist.find(g => g.id === viewingGame.steam_appid) ? 'İstek Listesinde' : 'İstek Listesine Ekle'}
                                    </button>
                                 </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#0a0f16]">
             <div className="bg-[#10141b]/95 backdrop-blur-xl py-4 px-10 flex gap-10 text-sm font-bold text-[#8f98a0] shadow-lg border-b border-white/5 sticky top-0 z-40">
                <span onClick={() => setStoreSubTab('home')} className={`cursor-pointer transition hover:text-white flex items-center gap-2 ${storeSubTab === 'home' ? 'text-white border-b-2 border-[#1a9fff] pb-4 -mb-4' : ''}`}>{t('browse')}</span>
                <span onClick={() => setStoreSubTab('dlc')} className={`cursor-pointer transition hover:text-white flex items-center gap-2 ${storeSubTab === 'dlc' ? 'text-white border-b-2 border-[#1a9fff] pb-4 -mb-4' : ''}`}>{t('dlcs')}</span>
                <span onClick={() => setStoreSubTab('search')} className={`cursor-pointer transition hover:text-white flex items-center gap-2 ${storeSubTab === 'search' ? 'text-white border-b-2 border-[#1a9fff] pb-4 -mb-4' : ''}`}>{t('searchRes')}</span>
             </div>

             <div className="max-w-[1400px] mx-auto w-full px-10 pt-10 pb-20">
                 {storeSubTab === 'home' && (
                     <>
                         <h2 className="text-white font-black text-2xl mb-6 tracking-wide drop-shadow-md">Öne Çıkan AAA Kalite</h2>
                         <div className="relative h-[480px] w-full bg-[#000] flex rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-pointer group overflow-hidden border border-white/10 hover:border-white/30 transition duration-500 mb-16" onClick={() => handleStoreGameClick(slides[currentSlide].id)}>
                             <div className="absolute inset-0 z-0">
                                 <img src={slides[currentSlide].img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-60 group-hover:opacity-80" />
                                 <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f16] via-[#0a0f16]/80 to-transparent"></div>
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-transparent to-transparent"></div>
                             </div>
                             <div className="flex-1 p-14 flex flex-col justify-center relative z-10 w-1/2">
                                 <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl leading-tight">{slides[currentSlide].title}</h1>
                                 <p className="text-[#acb2b8] text-lg mb-8 leading-relaxed max-w-lg">{slides[currentSlide].desc}</p>
                                 <div className="mt-auto">
                                     <div className="text-2xl font-black text-white bg-gradient-to-r from-[#1a9fff] to-[#0051ff] inline-block px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(26,159,255,0.4)]">{slides[currentSlide].price}</div>
                                 </div>
                             </div>
                         </div>
                     </>
                 )}

                 {(storeSubTab === 'home' || storeSubTab === 'search') && (
                     <>
                         <h2 className="text-white font-black text-xl mb-6 tracking-wide">
                             {storeSubTab === 'search' ? `${t('searchRes')} (${storeGames.length})` : `${t('browse')} (${storeGames.length})`}
                         </h2>
                         {storeGames.length === 0 ? (
                             <div className="text-[#8f98a0] text-sm flex items-center gap-3">
                                 <div className="w-5 h-5 border-2 border-[#1a9fff] border-t-transparent rounded-full animate-spin"></div>
                                 A-Kalite Veriler yükleniyor...
                             </div>
                         ) : (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {storeGames.map((game, i) => (
                                   <div key={game.uniqueKey || i} onClick={() => handleStoreGameClick(game.steam_appid || game.id)} className="bg-[#16202d] rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(26,159,255,0.2)] hover:-translate-y-2 transition duration-300 cursor-pointer group flex flex-col overflow-hidden border border-white/5 hover:border-[#1a9fff]/50">
                                      <div className="relative w-full aspect-[460/215] overflow-hidden bg-[#000]">
                                         <img src={game.header_image || game.tiny_image} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
                                      </div>
                                      <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#16202d] to-[#101318]">
                                         <div className="text-[15px] font-bold text-[#c6d4df] group-hover:text-white mb-4 line-clamp-2 leading-snug">{game.name}</div>
                                         <div className="mt-auto flex justify-between items-end">
                                             <div className="text-[#8f98a0] text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-black/40 rounded border border-white/5">Oyun</div>
                                             <div className="text-[#1a9fff] font-black text-sm">{formatToUSD(game.price_overview?.final_formatted, game.price_overview || game.price)}</div>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                         )}
                     </>
                 )}

                 {storeSubTab === 'dlc' && (
                     <>
                         <h2 className="text-white font-black text-xl mb-6 tracking-wide flex items-center gap-3"><Plus className="text-[#1a9fff]"/> {t('dlcs')}</h2>
                         {dlcGames.length === 0 ? (
                             <div className="text-[#8f98a0] text-sm">Hiçbir eklenti bulunamadı.</div>
                         ) : (
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {dlcGames.map((game, i) => (
                                   <div key={i} onClick={() => handleStoreGameClick(game.id)} className="bg-[#16202d] rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(163,56,219,0.2)] hover:-translate-y-2 transition duration-300 cursor-pointer group flex flex-col overflow-hidden border border-white/5 hover:border-[#a338db]/50">
                                      <div className="relative w-full aspect-[460/215] overflow-hidden bg-[#000]">
                                         <img src={game.tiny_image} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
                                      </div>
                                      <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#16202d] to-[#101318]">
                                         <div className="text-[13px] font-bold text-[#c6d4df] group-hover:text-white mb-4 line-clamp-2 leading-snug">{game.name}</div>
                                         <div className="mt-auto flex justify-between items-end">
                                             <div className="text-[#a338db] text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-[#a338db]/10 rounded border border-[#a338db]/20">DLC</div>
                                             <div className="text-white font-black text-sm">{formatToUSD(game.price?.final ? (game.price.final/100)+" TL" : null, game.price)}</div>
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
                <div className="flex items-center bg-[#25282e] rounded-lg border border-transparent focus-within:border-[#1a9fff] transition p-1.5 shadow-inner">
                    <Search size={16} className="text-[#a8b1b8] ml-2"/>
                    <input type="text" placeholder="Kütüphanede ara..." value={libSearchText} onChange={(e) => setLibSearchText(e.target.value)} className="w-full bg-transparent text-[#dcdedf] p-1.5 text-sm outline-none"/>
                </div>
                <div className="flex items-center justify-between px-1 text-[11px] text-[#748796] font-bold uppercase tracking-wider mt-2">
                    <span>Oyunlar</span>
                    <select value={libSortType} onChange={e => setLibSortType(e.target.value)} className="bg-transparent outline-none cursor-pointer hover:text-white">
                        <option value="alpha">Alfabetik</option>
                        <option value="playtime">Oynama Süresi</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-10">
               {processedLibraryGames.length === 0 ? (
                   <div className="text-xs text-gray-500 text-center mt-4">Kütüphane temiz.</div>
               ) : (
                   <div>
                       {favGamesList.length > 0 && (
                           <div className="mb-6">
                               <div className="text-[10px] font-black text-[#1a9fff] uppercase tracking-widest px-5 mb-2 bg-[#1a9fff]/10 py-1.5 border-y border-[#1a9fff]/20">Favoriler ({favGamesList.length})</div>
                               {favGamesList.map(game => (
                                  <div key={game.id} onClick={() => handleLibraryGameClick(game)} className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer group transition ${selectedLibGame?.id === game.id ? 'bg-[#3e4451] text-white border-l-4 border-[#1a9fff]' : 'text-[#8f98a0] hover:bg-[#2e323b] hover:text-white border-l-4 border-transparent'}`}>
                                     <img src={game.icon} onError={(e)=>{e.target.src=game.img}} className={`w-8 h-8 rounded shadow-md object-cover ${!game.installed && 'opacity-40 grayscale'}`} />
                                     <span className={`text-[14px] font-bold truncate ${!game.installed && 'text-[#748796] font-medium'}`}>{game.title}</span>
                                     {game.installed && <div className="ml-auto w-2 h-2 bg-[#1a9fff] rounded-full shadow-[0_0_8px_#1a9fff]"></div>}
                                  </div>
                               ))}
                           </div>
                       )}
                       
                       <div className="text-[10px] font-black text-[#748796] uppercase tracking-widest px-5 mb-2 bg-[#1b1c20] py-1.5 border-y border-[#2a2c31]">Tüm Oyunlar ({normalGamesList.length})</div>
                       {normalGamesList.map(game => (
                          <div key={game.id} onClick={() => handleLibraryGameClick(game)} className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer group transition ${selectedLibGame?.id === game.id ? 'bg-[#3e4451] text-white border-l-4 border-[#1a9fff]' : 'text-[#8f98a0] hover:bg-[#2e323b] hover:text-white border-l-4 border-transparent'}`}>
                             <img src={game.icon} onError={(e)=>{e.target.src=game.img}} className={`w-8 h-8 rounded shadow-md object-cover ${!game.installed && 'opacity-40 grayscale'}`} />
                             <span className={`text-[14px] font-bold truncate ${!game.installed && 'text-[#748796] font-medium'}`}>{game.title}</span>
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
                  <div className="h-[450px] relative w-full shrink-0 bg-[#0a0f16]">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#1e2024] via-transparent to-[#1e2024]/50 z-10"></div>
                     <img src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${selectedLibGame.id}/library_hero.jpg`} onError={(e)=>{e.target.src=libGameDetails?.background || selectedLibGame.header}} className="w-full h-full object-cover opacity-70 mask-image-b-gradient" />
                     <div className="absolute bottom-16 left-12 z-20">
                         <img src={selectedLibGame.logo || selectedLibGame.header} className="max-w-[450px] max-h-[160px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,1)]" />
                     </div>
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#1e2024] to-[#1e2024] border-b border-[#2a2c31] sticky top-0 z-30 shadow-2xl">
                      <div className="flex items-center gap-10 px-12 py-6">
                          <button onClick={() => window.electron.launchGame({appId: selectedLibGame.id, action: selectedLibGame.installed ? 'run' : 'install'})} className={`px-20 py-4 rounded-xl text-2xl font-black flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all active:scale-95 hover:-translate-y-1 ${selectedLibGame.installed ? 'bg-gradient-to-r from-[#47b738] to-[#60e04d] text-white hover:brightness-110' : 'bg-gradient-to-r from-[#0062ff] to-[#0088ff] text-white hover:brightness-110'}`}>
                              {selectedLibGame.installed ? <Play fill="currentColor" size={24}/> : <Download size={24}/>} 
                              {selectedLibGame.installed ? t('play') : t('install')}
                          </button>
                          
                          <div className="flex gap-12 bg-[#16171a] p-5 rounded-xl border border-white/5 shadow-inner">
                              {!selectedLibGame.installed && (
                                  <div className="flex flex-col">
                                      <span className="text-[10px] text-[#748796] font-black uppercase tracking-widest">{t('reqSpace')}</span>
                                      <span className="text-[#dcdedf] text-lg font-bold">{selectedLibGame.size || "Bilinmiyor"}</span>
                                  </div>
                              )}
                              <div className="flex flex-col">
                                  <span className="text-[10px] text-[#748796] font-black uppercase tracking-widest">{t('lastPlayed')}</span>
                                  <span className="text-[#dcdedf] text-lg font-bold">{formatLastPlayed(selectedLibGame.lastPlayed)}</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[10px] text-[#748796] font-black uppercase tracking-widest">{t('playtime')}</span>
                                  <span className="text-[#dcdedf] text-lg font-bold">{formatPlayTime(selectedLibGame.playtime)}</span>
                              </div>
                              <div className="flex flex-col w-64">
                                  <span className="text-[10px] text-[#748796] font-black uppercase tracking-widest flex items-center gap-1.5"><Trophy size={14}/> {t('achievements')}</span>
                                  <div className="flex items-center gap-4 mt-1.5">
                                      <div className="flex-1 bg-[#25282e] h-3 rounded-full overflow-hidden border border-[#1a1b1e]">
                                          <div className="bg-gradient-to-r from-[#1a9fff] to-[#53a4c4] h-full shadow-[0_0_15px_#1a9fff]" style={{width: `${getSimulatedAchievements(selectedLibGame.id).percentage}%`}}></div>
                                      </div>
                                      <span className="text-white text-sm font-black">{getSimulatedAchievements(selectedLibGame.id).current}/{getSimulatedAchievements(selectedLibGame.id).total}</span>
                                  </div>
                              </div>
                          </div>
                          <button onClick={() => toggleFavorite(selectedLibGame.id)} className={`p-4 rounded-xl transition-all ml-auto border ${favoriteGames.includes(selectedLibGame.id) ? 'bg-[#1a9fff]/10 border-[#1a9fff] text-[#1a9fff] shadow-[0_0_20px_rgba(26,159,255,0.3)] scale-105' : 'bg-[#2a2c31] border-transparent text-[#dcdedf] hover:bg-[#32353b]'}`}><Star size={24} className={favoriteGames.includes(selectedLibGame.id) ? "fill-current" : ""}/></button>
                      </div>
                  </div>

                  <div className="p-12 flex gap-10">
                      <div className="flex-[2] flex flex-col gap-8">
                          <div className="bg-[#212329] border border-[#2a2c31] p-10 rounded-2xl shadow-2xl">
                              <h3 className="text-[#1a9fff] font-black mb-6 text-xl border-b border-[#2a2c31] pb-3">{t('about')}</h3>
                              {libGameDetails ? <div className="text-[15px] text-[#acb2b8] leading-relaxed" dangerouslySetInnerHTML={{__html: libGameDetails.detailed_description || libGameDetails.short_description}}></div> : <div className="text-sm text-[#748796] font-bold">Steam veritabanından bilgiler yükleniyor...</div>}
                          </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-8">
                          <div>
                              <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-[#dcdedf] font-black tracking-wide text-sm uppercase flex items-center gap-2"><Sparkles size={16} className="text-[#1a9fff]"/> Dinamik FPS Analizi</h3>
                                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-md border ${fpsSource === 'AI MOTORU' ? 'bg-[#1a9fff]/20 text-[#1a9fff] border-[#1a9fff]/50' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}>{fpsSource}</span>
                              </div>
                              <div className="bg-gradient-to-br from-[#1b2838] to-[#101216] border border-[#1a9fff]/30 p-10 rounded-2xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#1a9fff] to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                  <div className="text-7xl font-black text-[#1a9fff] drop-shadow-[0_0_30px_rgba(26,159,255,0.5)] tracking-tighter mb-2">{aiFpsResult}</div>
                                  <div className="text-[#8f98a0] text-xs mt-6 bg-black/50 py-2.5 px-5 rounded-full inline-block border border-white/5 font-medium">Donanım: {systemSpecs?.gpu}</div>
                              </div>
                          </div>
                      </div>
                  </div>
               </div>
            ) : <div className="h-full flex items-center justify-center text-[#556772] text-3xl font-black tracking-widest uppercase opacity-40">Kütüphaneden oyun seçin</div>}
         </div>
      </div>
  );

  const renderCommunity = () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#171a21] animate-fade-in p-10 text-center">
          <Users size={100} className="text-[#2a475e] mb-8 drop-shadow-lg"/>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{t('community')}</h1>
          <p className="text-[#8f98a0] max-w-lg text-lg font-medium">Topluluk sekmesi çok yakında sizlerle olacak. Geliştirme aşamasında.</p>
      </div>
  );

  const renderProfile = () => (
      <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-20 bg-[#171a21]">
          <div className="fixed inset-0 z-0 pointer-events-none">
              {profile.profileBg ? (
                  profile.isBgVideo ?
                  <video ref={profileVideoRef} src={profile.profileBg} autoPlay loop muted={profile.bgVolume === 0} style={{ opacity: profile.profileBgOpacity }} className="w-full h-full object-cover"/> :
                  <img src={profile.profileBg} style={{ opacity: profile.profileBgOpacity }} className="w-full h-full object-cover" />
              ) : (
                  <div className="w-full h-full bg-[#171a21]"></div>
              )}
          </div>

          <div className="max-w-[1200px] mx-auto p-10 relative z-10 pt-16">
              <div className="bg-[#1b2838]/80 backdrop-blur-2xl p-10 rounded-3xl border border-[#2a475e]/50 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex gap-10 items-start mb-12 relative">
                  <button onClick={() => setIsEditingProfile(true)} className="absolute top-8 right-8 text-gray-400 hover:text-white flex items-center gap-2 text-sm bg-black/40 px-5 py-2.5 rounded-xl transition border border-transparent hover:border-[#66c0f4]/50 font-bold"><Edit3 size={16}/> Profili Düzenle</button>
                  
                  <div className="relative shrink-0 z-[150] group">
                      <div className={`w-44 h-44 rounded-xl relative z-10 bg-[#171d25] p-1.5 ${getFrameCSS(profile.avatarFrame)}`}>
                          <img src={profile?.image || defaultProfile.image} className="w-full h-full object-cover rounded-lg shadow-inner" />
                      </div>
                      <div className="absolute -bottom-3 right-3 z-20 bg-[#171d25] p-2 rounded-full"><StatusIcon status={profile?.status} size={28}/></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col pt-4">
                      <h1 className="text-6xl font-black text-white mb-2 flex items-center gap-4 tracking-tight">
                          {profile?.name} 
                          <span className="text-2xl font-black text-[#1a9fff] border-2 border-[#1a9fff] w-14 h-14 flex items-center justify-center rounded-full bg-[#101216] shadow-[0_0_20px_rgba(26,159,255,0.4)] ml-2">{profile?.level}</span>
                          <img src={`https://community.cloudflare.steamstatic.com/public/images/countryflags/${(profile?.countryCode || 'tr').toLowerCase()}.gif`} onError={(e) => e.target.style.display='none'} className="w-10 h-6 shadow-md ml-2 rounded-sm"/>
                      </h1>
                      <div className="text-[16px] text-[#8f98a0] mb-8 font-bold flex gap-4">
                          <span className="text-white bg-white/10 px-3 py-1 rounded">{profile.realName}</span>
                          <span className="text-[#66c0f4] bg-[#66c0f4]/10 px-3 py-1 rounded">{profile.country}</span>
                      </div>
                      <p className="text-[#dcdedf] text-lg mb-10 max-w-2xl leading-relaxed italic border-l-4 border-[#1a9fff] pl-6 py-2 bg-gradient-to-r from-black/40 to-transparent rounded-r">"{profile?.bio}"</p>
                      
                      <div className="mt-auto flex gap-6 text-base">
                          <div className="bg-[#101216]/90 px-6 py-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-inner"><Activity size={24} className="text-[#1a9fff]"/> <span className="text-[#748796] font-bold uppercase text-xs">Süre:</span> <span className="font-black text-white">{getFormatTime(appUsageSeconds)}</span></div>
                          <div className="bg-[#101216]/90 px-6 py-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-inner"><Gamepad2 size={24} className="text-[#1a9fff]"/> <span className="text-[#748796] font-bold uppercase text-xs">Oyunlar:</span> <span className="font-black text-white">{libraryGames.length}</span></div>
                      </div>
                  </div>
              </div>

              <div className="flex gap-10">
                  <div className="flex-[2] space-y-10">
                      {favoriteGames.length > 0 && (
                          <div className="bg-[#1b2838]/80 backdrop-blur-md p-10 rounded-3xl border border-[#2a475e]/40 shadow-2xl">
                              <h2 className="text-[#dcdedf] text-xl font-black uppercase tracking-widest border-b border-[#2a475e] pb-4 mb-8 flex items-center gap-3"><Star size={24} className="text-yellow-500 fill-current"/> Favori Oyun Vitrini</h2>
                              <div className="grid grid-cols-2 gap-6">
                                  {favoriteGames.map(id => {
                                      const g = libraryGames.find(x => x.id === id);
                                      if(!g) return null;
                                      return (
                                          <div key={id} onClick={() => navigateToLibraryGame(g.id)} className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl border border-[#2a2c31] hover:border-[#66c0f4] transition duration-300 h-40">
                                              <img src={g.header || g.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" title={g.title}/>
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-5">
                                                  <span className="text-white font-black truncate text-xl drop-shadow-lg">{g.title}</span>
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}

                      <div className="bg-[#1b2838]/80 backdrop-blur-md p-10 rounded-3xl border border-[#2a475e]/40 shadow-2xl">
                          <h2 className="text-[#dcdedf] text-xl font-black border-b border-[#2a475e] pb-4 mb-8 flex items-center gap-3"><ImageIcon size={24} className="text-[#66c0f4]"/> Ekran Görüntüleri</h2>
                          {screenshots.length === 0 ? (
                              <div className="text-[#748796] text-lg text-center py-16 bg-black/30 rounded-2xl border border-white/5 border-dashed font-bold cursor-pointer hover:bg-black/50 transition" onClick={() => screenInputRef.current.click()}>Kendi ekran görüntülerini yükleyerek profilini özelleştir. Buraya Tıkla.</div>
                          ) : (
                              <div className="flex flex-col gap-6">
                                  {screenshots.map((s,i) => (
                                      <div key={i} className="relative group cursor-pointer w-full">
                                          <img src={s} className="w-full h-auto object-contain rounded-2xl border-2 border-[#2a475e] group-hover:border-[#66c0f4] transition duration-300 shadow-2xl opacity-90 group-hover:opacity-100" />
                                          <button onClick={(e) => {e.stopPropagation(); removeScreenshot(i);}} className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition shadow-lg"><Trash2 size={20}/></button>
                                      </div>
                                  ))}
                                  <button onClick={() => screenInputRef.current.click()} className="mt-4 text-sm bg-gradient-to-r from-[#2a475e] to-[#1b2838] hover:from-[#1a9fff] hover:to-[#53a4c4] text-white py-4 rounded-xl transition font-black shadow-lg border border-[#3e4552] flex items-center justify-center gap-2"><Plus size={18}/> Yeni Görsel Ekle</button>
                              </div>
                          )}
                      </div>

                      <div className="bg-[#1b2838]/80 backdrop-blur-md p-10 rounded-3xl border border-[#2a475e]/40 shadow-2xl">
                          <h2 className="text-[#dcdedf] text-xl font-black border-b border-[#2a475e] pb-4 mb-8 flex items-center gap-3"><MessageSquare size={24} className="text-[#66c0f4]"/> Yorumlar</h2>
                          <div className="flex gap-5 mb-10">
                              <img src={profile.image} className={`w-14 h-14 rounded-lg border-2 border-[#2a475e] object-cover bg-[#171d25] ${getFrameCSS(profile.avatarFrame)}`} />
                              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={addComment} placeholder="Profiline yorum bırak..." className="flex-1 bg-[#101216]/80 border border-[#2a475e] p-4 rounded-xl text-base text-white focus:border-[#1a9fff] outline-none shadow-inner transition" />
                          </div>
                          <div className="space-y-4">
                              {profileComments.map((c) => (
                                  <div key={c.id || c.date} className="flex gap-6 items-start bg-[#101216]/80 p-6 rounded-2xl border border-white/5 hover:border-[#2a475e] transition duration-300 group">
                                      <img src={c.image} className="w-14 h-14 rounded-lg border border-[#2a475e] object-cover bg-[#171d25]" />
                                      <div className="flex-1 relative">
                                          <div className="flex items-center gap-4 mb-2">
                                              <span className="text-[16px] font-black text-[#66c0f4] cursor-pointer hover:underline">{c.user}</span>
                                              <span className="text-[12px] text-[#556772] font-bold">{c.date}</span>
                                          </div>
                                          <div className="text-[15px] text-[#acb2b8] leading-relaxed pr-8 font-medium">{c.text}</div>
                                          {c.user !== "Sistem" && (
                                              <button onClick={() => deleteComment(c.id)} className="absolute top-0 right-0 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><X size={18}/></button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 space-y-10">
                      <div className="bg-[#1b2838]/80 backdrop-blur-md p-8 rounded-3xl border border-[#2a475e]/40 shadow-2xl">
                          <h2 className="text-white border-b border-[#2a475e] pb-4 mb-6 font-black text-xl flex items-center gap-3"><Shield size={24} className="text-[#8f98a0]"/> Sistem Profili</h2>
                          <div className="space-y-4 text-base text-[#8f98a0]">
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5"><div className="text-[11px] uppercase font-black text-[#556772] mb-1.5">İşletim Sistemi</div><div className="text-[#dcdedf] font-bold">{systemSpecs?.os}</div></div>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5"><div className="text-[11px] uppercase font-black text-[#556772] mb-1.5">Ekran Kartı</div><div className="text-[#1a9fff] font-black truncate" title={systemSpecs?.gpu}>{systemSpecs?.gpu}</div></div>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5"><div className="text-[11px] uppercase font-black text-[#556772] mb-1.5">İşlemci</div><div className="text-[#1a9fff] font-black truncate" title={systemSpecs?.cpu}>{systemSpecs?.cpu}</div></div>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5"><div className="text-[11px] uppercase font-black text-[#556772] mb-1.5">RAM</div><div className="text-white font-black">{systemSpecs?.ram}</div></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-screen bg-[#171d25] text-[#c6d4df] flex flex-col font-sans select-none overflow-hidden border border-[#3d4450]">
      {/* ÜST BAR */}
      <div className="h-8 flex justify-between items-center px-4 bg-[#10141b] drag-region shrink-0 z-[100] border-b border-white/5">
        <div className="text-[11px] text-[#8f98a0] font-black tracking-widest flex items-center gap-2 uppercase">STEAM <span className="bg-gradient-to-r from-[#1a9fff] to-[#0051ff] text-white text-[9px] px-1.5 py-0.5 rounded shadow-md">SR Ultimate</span></div>
        <div className="flex no-drag h-full items-center">
          <button onClick={() => window.electron.minimize()} className="w-10 h-full hover:bg-white/10 text-[#8f98a0] hover:text-white transition flex items-center justify-center"><Minus size={14}/></button>
          <button onClick={() => window.electron.maximize()} className="w-10 h-full hover:bg-white/10 text-[#8f98a0] hover:text-white transition flex items-center justify-center"><Square size={12}/></button>
          <button onClick={() => window.electron.close()} className="w-10 h-full hover:bg-red-500 text-[#8f98a0] hover:text-white transition flex items-center justify-center"><X size={14}/></button>
        </div>
      </div>

      <div className="px-8 py-3 bg-[#171d25] flex justify-between items-center shrink-0 z-50 drag-region relative shadow-xl border-b border-[#2a2c31]">
         <div className="flex items-center gap-10 no-drag">
            {/* ESKİ LOGO GERİ DÖNDÜ */}
            <div className="flex flex-col cursor-pointer group" onClick={() => {setActiveTab('store'); setViewingGame(null); setStoreSubTab('home');}}>
                <h1 className="text-[28px] font-black italic text-white tracking-tighter leading-none group-hover:text-[#e0e0e0] transition">STEAM</h1>
                <span className="text-[10px] text-[#1a9fff] font-black tracking-widest uppercase mt-0.5">SR • Ultimate Edition</span>
            </div>
            <nav className="flex gap-8 text-[14px] font-black text-[#b8b6b4] uppercase tracking-wider ml-6 mt-1">
               <button onClick={() => {setActiveTab('store'); setViewingGame(null);}} className={`hover:text-white transition ${activeTab==='store'?'text-[#1a9fff] drop-shadow-[0_0_8px_rgba(26,159,255,0.5)]':''}`}>{t('store')}</button>
               <button onClick={() => setActiveTab('library')} className={`hover:text-white transition ${activeTab==='library'?'text-[#1a9fff] drop-shadow-[0_0_8px_rgba(26,159,255,0.5)]':''}`}>{t('library')}</button>
               <button onClick={() => setActiveTab('community')} className={`hover:text-white transition ${activeTab==='community'?'text-[#1a9fff] drop-shadow-[0_0_8px_rgba(26,159,255,0.5)]':''}`}>{t('community')}</button>
               <button onClick={() => setActiveTab('settings')} className={`hover:text-white transition ${activeTab==='settings'?'text-[#1a9fff] drop-shadow-[0_0_8px_rgba(26,159,255,0.5)]':''}`}>{t('settings')}</button>
               <button onClick={() => setActiveTab('profile')} className={`hover:text-white transition ${activeTab==='profile'?'text-[#1a9fff] drop-shadow-[0_0_8px_rgba(26,159,255,0.5)]':''}`}>{profile?.name}</button>
            </nav>
         </div>
         
         <div className="flex items-center gap-6 no-drag relative">
             <div className="relative group z-[300]">
                 <div className="relative">
                     <input type="text" value={searchQuery} onChange={handleSearchChange} onKeyDown={handleGlobalSearchSubmit} placeholder={t('search')} className="bg-[#101216] border border-[#3e4552] text-white px-5 py-2 pl-10 rounded-full text-sm w-64 outline-none focus:border-[#1a9fff] transition shadow-inner" />
                     <Search size={16} className="absolute left-3.5 top-2.5 text-gray-500 group-focus-within:text-[#1a9fff] transition"/>
                     {isSearching && <div className="absolute right-4 top-2.5 w-4 h-4 border-2 border-t-transparent border-[#1a9fff] rounded-full animate-spin"></div>}
                 </div>
                 {searchResults.length > 0 && searchQuery.length > 2 && (
                     <div className="absolute top-full mt-3 w-80 bg-[#1b2838] border border-[#2a475e] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden right-0">
                         <div className="text-[10px] font-black text-[#8f98a0] p-3 bg-[#10141b] border-b border-white/5 uppercase tracking-widest">{t('searchRes')}</div>
                         {searchResults.slice(0, 5).map(g => (
                             <div key={g.id} onClick={() => { handleStoreGameClick(g.id); setSearchResults([]); setSearchQuery(""); }} className="flex gap-4 p-3 hover:bg-[#2a475e] cursor-pointer border-b border-white/5 transition group">
                                 <img src={g.tiny_image} className="w-16 object-cover rounded shadow-md group-hover:scale-105 transition" />
                                 <div className="flex flex-col justify-center">
                                     <div className="text-white text-[13px] font-bold line-clamp-1">{g.name}</div>
                                     <div className="text-[#1a9fff] text-xs font-black mt-1">{formatToUSD(g.price?.final ? (g.price.final/100)+" TL" : null, g.price)}</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </div>

             <div className="relative z-[300]">
                 <button onClick={() => {setIsNotifOpen(!isNotifOpen); markNotifsAsRead();}} className="relative p-2 text-[#b8b6b4] hover:text-white transition">
                     <Bell size={20} className={unreadNotifs > 0 ? "animate-[wiggle_1s_ease-in-out_infinite]" : ""}/>
                     {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#171d25] shadow-[0_0_8px_red]"></span>}
                 </button>
                 {isNotifOpen && (
                     <div className="absolute top-full mt-3 right-0 w-80 bg-[#1b2838] border border-[#2a475e] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                         <div className="bg-[#10141b] p-3 border-b border-white/5 flex justify-between items-center">
                             <span className="text-xs font-black text-white uppercase tracking-widest">{t('notifs')}</span>
                             <button onClick={() => {setNotifications([]); localStorage.setItem('sr_notifs_v8', '[]');}} className="text-[10px] text-[#8f98a0] hover:text-white uppercase font-bold">{t('clear')}</button>
                         </div>
                         <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                             {notifications.length === 0 ? (
                                 <div className="p-8 text-center text-sm text-[#748796] font-bold">Okunmamış bildirim yok.</div>
                             ) : (
                                 notifications.map(n => (
                                     <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-[#2a475e]/50 transition ${!n.read ? 'bg-[#1a9fff]/5' : ''}`}>
                                         <div className="flex justify-between items-start mb-1">
                                             <div className="text-[13px] font-black text-white">{n.title}</div>
                                             <div className="text-[10px] text-[#556772] font-bold">{n.time}</div>
                                         </div>
                                         <div className="text-[12px] text-[#8f98a0] leading-snug">{n.desc}</div>
                                     </div>
                                 ))
                             )}
                         </div>
                     </div>
                 )}
             </div>

             <div className="relative z-[200] group py-2 pl-2 border-l border-white/10">
                 <div className="relative cursor-pointer" onClick={() => setActiveTab('profile')}>
                     <img src={profile?.image || defaultProfile.image} className={`w-10 h-10 rounded-lg object-cover bg-[#171d25] shadow-md ${getFrameCSS(profile.avatarFrame)}`} />
                     <div className="absolute -bottom-1 -right-1 bg-[#171d25] p-0.5 rounded-full"><StatusIcon status={profile?.status} size={12}/></div>
                 </div>
             </div>
         </div>
      </div>

      <main className="flex-1 overflow-hidden bg-[#1b2838] relative flex flex-col z-0">
          {activeTab === 'store' && renderStore()}
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'community' && renderCommunity()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'profile' && renderProfile()}
      </main>

      {/* ARKADAŞLAR VE SOHBET SİSTEMİ (TAM FONKSİYONEL) */}
      <div className="fixed bottom-0 right-10 z-[500] flex items-end">
          {activeChatUser && (
              <div className="w-[320px] h-[400px] bg-[#1b2838] border border-[#2a475e] rounded-t-lg shadow-2xl flex flex-col mr-2">
                  <div className="bg-[#10141b] p-3 border-b border-[#2a475e] flex justify-between items-center rounded-t-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                          <div className="relative">
                              <img src={activeChatUser.avatar} className="w-8 h-8 rounded border border-[#2a475e]"/>
                              <div className="absolute -bottom-1 -right-1 bg-[#10141b] p-0.5 rounded-full"><FriendStatusIcon status={activeChatUser.status} size={8}/></div>
                          </div>
                          <div>
                              <div className="text-white text-sm font-bold leading-none">{activeChatUser.name}</div>
                              <div className="text-[#90ba3c] text-[10px] font-bold mt-0.5">{activeChatUser.game || "Çevrimiçi"}</div>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => setActiveChatUser(null)} className="text-[#8f98a0] hover:text-white"><Minus size={16}/></button>
                          <button onClick={() => setActiveChatUser(null)} className="text-[#8f98a0] hover:text-white"><X size={16}/></button>
                      </div>
                  </div>
                  <div className="flex-1 bg-[#16202d] overflow-y-auto custom-scrollbar p-3 space-y-3" ref={chatScrollRef}>
                      <div className="text-center text-[10px] text-[#556772] font-bold mb-4 border-b border-white/5 pb-2">Sohbet Geçmişi</div>
                      {chatMessages[activeChatUser.id]?.map((msg, i) => (
                          <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                              <div className="text-[9px] text-[#556772] mb-0.5">{msg.time}</div>
                              <div className={`p-2.5 rounded-lg max-w-[85%] text-[13px] font-medium ${msg.sender === 'me' ? 'bg-[#1a9fff] text-white rounded-br-none shadow-md' : 'bg-[#2a475e] text-[#dcdedf] rounded-bl-none border border-white/5'}`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="bg-[#10141b] p-3 flex gap-2">
                      <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Mesaj gönder..." className="flex-1 bg-[#1b2838] border border-[#2a475e] rounded p-2 text-sm text-white outline-none focus:border-[#1a9fff]"/>
                      <button onClick={handleSendMessage} className="bg-[#1a9fff] text-white p-2 rounded hover:brightness-110 transition"><Send size={16}/></button>
                  </div>
              </div>
          )}

          {isFriendsOpen && (
              <div className="w-[300px] h-[550px] bg-[#16202d] border border-[#2a475e] rounded-t-lg shadow-2xl flex flex-col">
                  <div className="bg-[#10141b] p-3 border-b border-[#2a475e] flex justify-between items-center rounded-t-lg">
                      <div className="text-white font-bold flex items-center gap-2"><Users size={16} className="text-[#1a9fff]"/> {t('friends')}</div>
                      <button onClick={() => setIsFriendsOpen(false)} className="text-[#8f98a0] hover:text-white"><Minimize2 size={16}/></button>
                  </div>
                  
                  <div className="p-3 bg-[#1b2838] flex items-center gap-3 border-b border-[#2a475e]">
                      <div className="relative">
                          <img src={profile.image} className="w-10 h-10 rounded border border-[#2a475e]"/>
                          <div className="absolute -bottom-1 -right-1 bg-[#1b2838] p-0.5 rounded-full"><FriendStatusIcon status="online" size={10}/></div>
                      </div>
                      <div className="flex-1">
                          <div className="text-white text-sm font-bold">{profile.name}</div>
                          <div className="text-[#8f98a0] text-[10px] font-bold mt-0.5 select-all">{t('myId')}: {myUserId}</div>
                      </div>
                  </div>

                  <div className="p-3 bg-[#10141b] border-b border-[#2a475e]">
                      <div className="text-[10px] text-[#8f98a0] font-black uppercase tracking-widest mb-2">{t('addFriend')}</div>
                      <div className="flex gap-2">
                          <input type="text" value={addFriendInput} onChange={e=>setAddFriendInput(e.target.value)} placeholder={t('typeId')} className="flex-1 bg-[#1b2838] border border-[#2a475e] rounded p-1.5 text-xs text-white outline-none focus:border-[#1a9fff]"/>
                          <button onClick={handleAddFriend} className="bg-[#2a475e] text-white px-3 py-1.5 rounded hover:bg-[#1a9fff] transition text-xs font-bold"><Plus size={14}/></button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      <div className="text-[10px] text-[#8f98a0] font-black uppercase tracking-widest mb-2 mt-2 px-2">Arkadaşlar ({friendsList.length})</div>
                      {friendsList.map(f => (
                          <div key={f.id} onClick={() => setActiveChatUser(f)} className="flex items-center gap-3 p-2 hover:bg-[#2a475e]/50 rounded cursor-pointer transition group relative">
                              <div className="relative">
                                  <img src={f.avatar} className={`w-8 h-8 rounded border ${f.status === 'in-game' ? 'border-[#90ba3c]' : f.status === 'online' ? 'border-[#53a4c4]' : 'border-[#556772] grayscale'}`}/>
                                  <div className="absolute -bottom-1 -right-1 bg-[#16202d] p-0.5 rounded-full"><FriendStatusIcon status={f.status} size={8}/></div>
                              </div>
                              <div className="flex-1">
                                  <div className={`text-[13px] font-bold ${f.status === 'in-game' ? 'text-[#90ba3c]' : f.status === 'online' ? 'text-[#53a4c4]' : 'text-[#8f98a0]'}`}>{f.name}</div>
                                  <div className={`text-[10px] font-bold line-clamp-1 ${f.status === 'in-game' ? 'text-[#90ba3c]' : 'text-[#556772]'}`}>{f.game || (f.status === 'offline' ? 'Çevrimdışı' : 'Çevrimiçi')}</div>
                              </div>
                              <button onClick={(e) => handleRemoveFriend(f.id, e)} className="absolute right-2 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {!isFriendsOpen && (
              <button onClick={() => setIsFriendsOpen(true)} className="bg-[#1b2838] border-t border-l border-r border-[#2a475e] px-4 py-2 rounded-t text-sm font-bold text-white flex items-center gap-2 hover:bg-[#2a475e] transition">
                  <Users size={16} className="text-[#1a9fff]"/> {t('friends')}
              </button>
          )}
      </div>

      {/* PROFİL DÜZENLEME MODALI */}
      {isEditingProfile && (
         <div className="absolute inset-0 z-[600] bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in">
            <div className="bg-[#1b2838] p-10 rounded-3xl shadow-[0_0_80px_rgba(26,159,255,0.3)] relative border border-[#1a9fff]/50 w-[650px] max-h-[90vh] overflow-y-auto custom-scrollbar">
               <h2 className="text-white font-black mb-8 flex items-center gap-3 text-2xl"><Settings size={28} className="text-[#1a9fff]"/> Profili Düzenle</h2>
               
               <div className="flex gap-8 mb-8 pb-8 border-b border-white/10">
                  <div className="flex flex-col items-center">
                      <div className="relative group cursor-pointer w-28 h-28 mb-2" onClick={() => fileInputRef.current.click()}>
                         <img src={profile?.image || defaultProfile.image} className={`w-full h-full rounded-2xl object-cover group-hover:opacity-40 transition bg-[#171d25] shadow-xl ${getFrameCSS(profile.avatarFrame)}`} />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={32} className="text-white drop-shadow-lg"/></div>
                      </div>
                  </div>
                  <div className="flex-1 space-y-4">
                      <div><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Kullanıcı Adı</label><input value={profile?.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-bold shadow-inner" /></div>
                      <div className="flex gap-4">
                          <div className="flex-[2]"><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Ülke</label><input value={profile?.country || ""} onChange={e => setProfile({...profile, country: e.target.value})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-bold shadow-inner" /></div>
                          <div className="flex-1"><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Kod</label><input value={profile?.countryCode || ""} onChange={e => setProfile({...profile, countryCode: e.target.value})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-bold uppercase shadow-inner" maxLength={2} placeholder="TR"/></div>
                      </div>
                  </div>
               </div>

               <div className="space-y-5 mb-8 pb-8 border-b border-white/10">
                  <div><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Hakkında (Bio)</label><textarea rows={3} value={profile?.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-medium custom-scrollbar resize-none shadow-inner" /></div>
                  <div className="flex gap-4">
                      <div className="flex-[2]"><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Gerçek İsim / Nick</label><input value={profile?.realName || ""} onChange={e => setProfile({...profile, realName: e.target.value})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-bold shadow-inner" /></div>
                      <div className="flex-1"><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest">Seviye</label><input type="number" value={profile?.level || 0} onChange={e => setProfile({...profile, level: parseInt(e.target.value) || 0})} className="w-full bg-[#101216] p-3 rounded-xl text-white border border-white/5 outline-none focus:border-[#1a9fff] mt-2 text-sm font-bold shadow-inner" /></div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#101216]/50 p-4 rounded-xl border border-white/5">
                      <div>
                          <label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest block">Arkaplan Medyası</label>
                          <div className="text-xs text-[#556772] mt-1 font-bold">{profile.profileBg ? "Kişisel aktif." : "Varsayılan."}</div>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={() => bgInputRef.current.click()} className="text-xs bg-[#2a475e] hover:bg-[#1a9fff] text-white px-4 py-2 rounded-lg transition font-bold">Yükle</button>
                          {profile.profileBg && <button onClick={() => setProfile({...profile, profileBg: null, isBgVideo: false})} className="text-xs bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg transition font-bold border border-red-600/50 hover:border-transparent">Kaldır</button>}
                      </div>
                  </div>

                  <div className="flex gap-4 bg-[#101216]/50 p-4 rounded-xl border border-white/5">
                      <div className="flex-1">
                          <label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest flex justify-between">
                              <span>Arkaplan Şeffaflığı</span>
                              <span className="text-[#1a9fff]">% {Math.round(profile.profileBgOpacity * 100)}</span>
                          </label>
                          <input type="range" min="0.05" max="1" step="0.05" value={profile.profileBgOpacity} onChange={e => setProfile({...profile, profileBgOpacity: parseFloat(e.target.value)})} className="w-full mt-3 accent-[#1a9fff]" />
                      </div>
                      <div className="flex-1">
                          <label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest flex justify-between">
                              <span>VİDEO SESİ</span>
                              <span className="text-[#1a9fff]">% {Math.round((profile.bgVolume || 0) * 100)}</span>
                          </label>
                          <input type="range" min="0" max="1" step="0.05" value={profile.bgVolume || 0} onChange={e => setProfile({...profile, bgVolume: parseFloat(e.target.value)})} className="w-full mt-3 accent-[#1a9fff]" />
                      </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#101216]/50 p-4 rounded-xl border border-white/5">
                      <label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest block">Avatar Çerçevesi</label>
                      <select value={profile?.avatarFrame || "none"} onChange={e => setProfile({...profile, avatarFrame: e.target.value})} className="bg-[#1b2838] border border-[#2a475e] p-2 rounded-lg text-white font-bold outline-none focus:border-[#1a9fff] text-xs cursor-pointer">
                          <option value="none">Klasik İnce</option>
                          <option value="neon">Siber Neon</option>
                          <option value="gold">Saf Altın</option>
                          <option value="dragon">Ejder Ateşi</option>
                      </select>
                  </div>

                  <div><label className="text-[10px] font-black text-[#8f98a0] uppercase tracking-widest mt-4 block">Çevrimiçi Durumu</label>
                      <div className="flex gap-4 mt-3">
                          {['online', 'idle', 'dnd', 'invisible'].map(s => (
                              <div key={s} onClick={() => setProfile({...profile, status: s})} className={`cursor-pointer p-4 rounded-xl transition flex items-center justify-center ${profile?.status === s ? 'bg-[#2a475e] shadow-inner border border-[#1a9fff]/50' : 'bg-[#101216] hover:bg-[#1b2838] border border-transparent'}`}><StatusIcon status={s} size={28}/></div>
                          ))}
                      </div>
                  </div>
               </div>
               <div className="flex gap-4 mt-10">
                  <button onClick={saveProfile} className="flex-1 bg-gradient-to-r from-[#1a9fff] to-[#0062ff] text-white font-black text-lg py-4 rounded-xl shadow-[0_10px_20px_rgba(26,159,255,0.3)] hover:brightness-110 transition active:scale-95">Değişiklikleri Kaydet</button>
                  <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-[#2a2c31] text-white font-black text-lg py-4 rounded-xl hover:bg-[#3e4451] transition active:scale-95">İptal Et</button>
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