# Türkçe / İngilizce tarama altyapısı

## Kapsam

- `/en` ve `/tr` altındaki ana sayfa, kurslar, öğretmenler, videolar, fiyatlar, iletişim ve ücretsiz kurs: toplam 14 public URL.
- Sayfa içeriği mevcut `public/locales/en.json` ve `tr.json` dosyalarından ilk HTML yanıtında hazırlanır. Sonradan bir çeviri isteğinin tamamlanması gerekmez.
- Accordion içeriği kapalıyken de HTML'dedir. Öğretmen açıklamaları, video başlıkları/açıklamaları ve fiyat tabloları JavaScript gerektirmeden okunabilir.
- Kurs takvimi aynı Vercel Blob kaynağından sunucuda alınır. Beş saniye içinde erişilemezse mevcut yerel dil dosyasındaki fallback kullanılır; tarayıcıdaki mevcut yenileme davranışı devam eder.
- İletişim sayfasında yalnızca Leaflet haritası tarayıcıda yüklenir. Adres ve iletişim bilgileri sunucuda işlenir.
- Görünen metinler, CSS, görseller, menüler ve sayfaların etkileşimleri korunur. Mevcut ana sayfa saat dilimi yönlendirmesi de korunmuştur.

## Metadata ve keşif

- Her public sayfa kendi dilinde başlık/açıklama, kendisini gösteren canonical, karşılıklı `en`, `tr` ve `x-default` hreflang bağlantılarına sahiptir.
- `html lang` ve `Content-Language` URL ile eşleşir. İstemci tarafında dil değişirse HTML dil etiketi de güncellenir.
- Next.js metadata streaming kapalıdır (`htmlLimitedBots: /.*/`); tüm okuyucular metadata'yı ilk `<head>` içinde alır. İçerik User-Agent'a göre değiştirilmez.
- `app/sitemap.ts`, 14 canonical URL'yi dil eşleşmeleriyle üretir. Gerçek bir değişiklik tarihi bilinmediğinde yapay `lastmod` yazılmaz.
- `app/robots.ts` ortak `User-agent: *` kuralıyla public içeriği, JavaScript/CSS dosyalarını ve medyayı Google, Bing ve AI tarayıcılarına açar. API, Studio ve başvuru sonuç yolları taramadan çıkarılır.
- Ödeme, yönetim, başvuru ve sonuç sayfaları public sitemap'e eklenmez. Public sayfalar dışındaki sayfalar kök layout'tan `noindex, nofollow` devralır. Robots kuralları kimlik doğrulamanın yerine geçmez.
- `app/llms.txt/route.ts` aynı URL listesinden iki dilde bir içerik rehberi üretir. Bu dosya isteğe bağlı bir keşif yardımcısıdır; bir indeksleme standardı veya garantisi değildir. Güncel HTML sayfaları asıl kaynaktır.
- JSON-LD, mevcut okul bilgileri, sayfa dili, kurs açıklamaları ve öğretmen profillerinden oluşturulur. Değerlendirme puanı, video yayın tarihi veya sertifika iddiası uydurulmaz.

## İçerik sınırları

Mevcut ücretsiz kurs kampanyasının ana metni iki URL'de de İngilizcedir; görünür metni değiştirmeme talebi nedeniyle çevrilmemiştir. Mevcut ses/video dosyaları için döküm üretilmemiştir; HTML'deki başlıklar ve açıklamalar erişilebilir durumdadır. Ana Türkçe/İngilizce sayfaların mevcut çevirileri aynen kullanılır.

## Doğrulama

```sh
npm run build
npm run start -- --port 3100
node scripts/check-seo.mjs http://localhost:3100
```

Kontrol betiği JavaScript çalıştırmadan HTML'yi ayrıştırır. Dil, tekil metadata, canonical/hreflang, JSON-LD, kurs ve öğretmen açıklamaları, fiyat tabloları, sitemap, robots.txt, llms.txt, 404/noindex, kök yönlendirmesi ve farklı robotlar için içerik eşitliğini doğrular. Form göndermez ve başvuru sonucu API'lerini çağırmaz. HTML ayrıştırıcısı `parse5` mevcut kilitli bağımlılık ağacında bulunur.

Yayın sonrası aynı betik üretim adresine karşı çalıştırılabilir:

```sh
node scripts/check-seo.mjs https://estoyonline.es
```

Ardından mevcut Google Search Console / Bing Webmaster Tools hesabında `https://estoyonline.es/sitemap.xml` gönderilebilir. CDN veya hosting katmanındaki bot engelleri ayrıca kontrol edilmelidir. Kod değişikliği, sitenin tekrar tarandığı veya indekslendiği anlamına gelmez.

## Kaynaklar

- [Google: AI özellikleri ve web siteniz](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Yerelleştirilmiş sayfalar ve hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [OpenAI tarayıcıları](https://developers.openai.com/api/docs/bots)
- [Next.js sitemap API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
