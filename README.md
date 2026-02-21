📖 Proje Hakkında
Steam Remake, React ve Electron.js kullanılarak geliştirilmiş, yüksek performanslı ve modern bir masaüstü oyun istemcisi alternatifidir. Oyunculara gelişmiş profil özelleştirmeleri, gerçek zamanlı donanım taraması ve kusursuz yerel oyun tespiti sunarak yeni nesil bir arayüz deneyimi yaşatmayı hedefler.

✨ Temel Özellikler
🎮 Yerel Oyun Senkronizasyonu: Bilgisayardaki yerel diskleri (C:, D: vb.) ve .acf dosyalarını otomatik tarayarak yüklü Steam oyunlarını ve gerçek boyutlarını tespit eder.

🤖 Dinamik FPS Analizi: systeminformation kütüphanesi ile sistem donanımınızı (GPU/CPU) okur ve seçilen oyun için tahmini/dinamik bir FPS değeri sunar.

🌐 Canlı Mağaza Entegrasyonu: Steam Web API üzerinden gerçek zamanlı oyun detaylarını, fiyatları, ekran görüntülerini ve HD fragmanları arayüze yansıtır.

🎨 Gelişmiş Profil Özelleştirme: Discord tarzı anlık durum (Çevrimiçi/Oyunda) sistemi, şeffaflık ayarlı video/fotoğraf arkaplanlar, avatar çerçeveleri ve yerel yorum sistemi içerir.

⚡ Yüksek Performans: Vite ve Electron altyapısı sayesinde anında açılır, Tailwind CSS ile tasarlanmış akıcı animasyonlara sahiptir.

🛠️ Kurulum
Bu uygulamayı kendi bilgisayarınızda çalıştırmak için Git ve Node.js yüklü olmalıdır.

Bash

# Projeyi klonlayın
$ git clone [https://github.com/SENIN_KULLANICI_ADIN/steam-remake.git](https://github.com/SENIN_KULLANICI_ADIN/steam-remake.git)

# Proje klasörüne girin
$ cd steam-remake

# Gerekli paketleri yükleyin
$ npm install

# Geliştirici modunda çalıştırın
$ npm run electron:dev

# Üretime hazır Kurulum (Setup.exe) dosyasını oluşturun
$ npm run build
Developer: Furkan (Nexarisa / Furky)