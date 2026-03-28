#!/usr/bin/env python3
"""Seed Tribal Istanbul ödülleri — awards collection (tribal: true flag)"""
import csv, json, urllib.request, urllib.error, time, os

PROJECT_ID = "agency-planing"
config_path = os.path.expanduser("~/.config/configstore/firebase-tools.json")
with open(config_path) as f:
    config = json.load(f)
TOKEN = config.get("tokens", {}).get("access_token", "")
BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

def firestore_value(v):
    if v is None: return {"nullValue": None}
    if isinstance(v, bool): return {"booleanValue": v}
    if isinstance(v, int): return {"integerValue": str(v)}
    if isinstance(v, float): return {"doubleValue": v}
    if isinstance(v, list): return {"arrayValue": {"values": [firestore_value(i) for i in v]}}
    if isinstance(v, dict): return {"mapValue": {"fields": {k: firestore_value(vv) for k, vv in v.items()}}}
    return {"stringValue": str(v)}

def to_doc(data):
    return {"fields": {k: firestore_value(v) for k, v in data.items()}}

def add_doc(collection, data):
    url = f"{BASE_URL}/{collection}"
    body = json.dumps(to_doc(data)).encode()
    req = urllib.request.Request(url, data=body, method="POST",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read()).get("name", "").split("/")[-1]
    except urllib.error.HTTPError as e:
        print(f"  ERR {e.code}: {e.read().decode()[:150]}")
        return None

# ────────────────────────────────────────────────────────────────────────────
# TRIBAL İSTANBUL ÖDÜLLERİ
# ────────────────────────────────────────────────────────────────────────────
TRIBAL_AWARDS = [

  # ── GRAND PRIX KAZANANLAR ──────────────────────────────────────────────────
  {
    "title": "Cumhuriyetin 100 Değeri",
    "brand": "Koç",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2024,
    "competition": "Mediacat Felis Ödülleri",
    "level": "Grand Prix",
    "category": "Integrated",
    "labels": ["Türkiye", "Kurumsal", "100. Yıl", "Tribal", "Felis"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Cumhuriyet'in 100. yılında Türkiye'nin en büyük şirketlerinden Koç, bu tarihi anı bir değerler manifestosuna dönüştürebilirdi.",
        "idea": "Türk toplumunu şekillendiren 100 değeri, Koç'un 100 yıllık mirasyıyla buluşturan entegre kampanya.",
        "execution": "TV, dijital, outdoor ve aktivasyon kanallarında 360 derece yürütüldü. Türkiye genelinde büyük yankı uyandırdı.",
        "result": "Felis 2024 Grand Prix. Türkiye'nin en prestijli ödülü. Koç ile Cumhuriyet'in 100. yılı arasında güçlü bağ kuruldu."
      },
      "en": {
        "insight": "In the Republic's centennial year, Koç — one of Turkey's largest companies — could turn this historic moment into a values manifesto.",
        "idea": "Integrated campaign connecting 100 values that shaped Turkish society with Koç's 100-year heritage.",
        "execution": "Executed 360 degrees across TV, digital, outdoor and activation channels. Resonated across Turkey.",
        "result": "Felis 2024 Grand Prix — Turkey's most prestigious advertising award. Strong link built between Koç and the Republic's centennial."
      }
    }
  },
  {
    "title": "GTA Kaza Sigortası",
    "brand": "Sigortam.net",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2023,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Dijital",
    "labels": ["Türkiye", "Oyun", "Finans", "Gaming", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Sigortanın sıkıcı imajını kırmak için insanların zaten ilgi gösterdiği bir dünyadan ilham almak gerekir.",
        "idea": "Grand Theft Auto oyunundaki araç kazalarını gerçek sigorta poliçesiyle ilişkilendiren akıllıca dijital kampanya.",
        "execution": "Oyun içi aktivasyon ve sosyal medya kampanyası. GTA oyuncularına gerçek hayattaki sigorta kavramı oyun diliyle anlatıldı.",
        "result": "Kristal Elma 2023 Dijital Grand Prix. Gençler arasında sigorta bilinirliğinde büyük artış. Tribal Istanbul'un en viral işlerinden biri."
      },
      "en": {
        "insight": "Breaking insurance's boring image requires drawing inspiration from a world people are already passionate about.",
        "idea": "Clever digital campaign linking vehicle crashes in Grand Theft Auto to real insurance policies.",
        "execution": "In-game activation and social media campaign. GTA players were told about real-life insurance in game language.",
        "result": "Kristal Elma 2023 Digital Grand Prix. Major increase in insurance awareness among young people. One of Tribal Istanbul's most viral campaigns."
      }
    }
  },
  {
    "title": "Faydası Çok",
    "brand": "TikTok",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2023,
    "competition": "Mediacat Felis Ödülleri",
    "level": "Grand Prix",
    "category": "Social Media",
    "labels": ["Türkiye", "Sosyal Medya", "TikTok", "Gençlik", "Tribal", "Felis"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "TikTok'un gençlerin yaşamında ne kadar faydalı bir yer tuttuğu yeterince anlatılmıyordu.",
        "idea": "TikTok'u eğlencenin ötesinde hayatı kolaylaştıran, öğreten ve ilham veren bir platform olarak konumlandıran kampanya.",
        "execution": "Gerçek TikTok kullanıcılarının deneyimlerinden beslenen içerikler. Spor, eğitim, kariyer ve günlük hayat hikayeleri.",
        "result": "Felis 2023 Grand Prix. Platform algısında pozitif dönüşüm. Kullanıcı aktivasyonunda önemli artış."
      },
      "en": {
        "insight": "TikTok's truly useful role in young people's lives was being underrepresented.",
        "idea": "Campaign positioning TikTok beyond entertainment — as a platform that simplifies, teaches and inspires daily life.",
        "execution": "Content drawn from real TikTok users' experiences. Stories covering sport, education, career and everyday life.",
        "result": "Felis 2023 Grand Prix. Positive shift in platform perception. Significant increase in user activation."
      }
    }
  },
  {
    "title": "Netflix — Uysallar",
    "brand": "Netflix",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2022,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Integrated",
    "labels": ["Türkiye", "Medya", "Film", "Sosyal Etki", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Netflix Türk dizi içerikleri yerel kültürü güçlü biçimde yansıtıyor — bu gücü bir kampanyaya dönüştürmek mümkün.",
        "idea": "Netflix'in Türk yapımı 'Uysallar' dizisini promosyon etmek için dizinin toplumsal yorumlarından ilham alan kampanya.",
        "execution": "Sosyal medya, dijital, OOH entegrasyonu. Dizi karakterleri gerçek hayat sahnelerinde yeniden canlandırıldı.",
        "result": "Kristal Elma 2022 Grand Prix. Netflix Türkiye'nin en büyük yerel içerik lansmanlarından biri. Tribal Istanbul için tarihi ödül."
      },
      "en": {
        "insight": "Netflix Turkish series strongly reflect local culture — this power can be turned into a campaign.",
        "idea": "Campaign inspired by the social commentary of Netflix's Turkish production 'Uysallar' to promote the series.",
        "execution": "Social media, digital and OOH integration. Series characters re-enacted in real-life scenes.",
        "result": "Kristal Elma 2022 Grand Prix. One of Netflix Turkey's biggest local content launches. Historic award for Tribal Istanbul."
      }
    }
  },
  {
    "title": "ING Trabzon ATM",
    "brand": "ING Türkiye",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2022,
    "competition": "Mediacat Felis Ödülleri",
    "level": "Grand Prix",
    "category": "Activation",
    "labels": ["Türkiye", "Finans", "Spor", "Aktivasyon", "Tribal", "Felis"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Trabzonspor şampiyonluğu sonrası Trabzon'da para çekmek isteyen kişiler uzun kuyruklar oluşturdu — bu bir marka anı.",
        "idea": "Şampiyonluk kutlamalarının yoğun olduğu Trabzon'da ING ATM'nin anında fark yaratan aktivasyonu.",
        "execution": "Trabzonspor şampiyonluğunu kutlayan ATM animasyonları ve sürpriz deneyimler. Sosyal medyada viral yayıldı.",
        "result": "Felis 2022 Grand Prix. ING'nin Trabzon özelindeki marka sevgisi rekor kırdı. Gerçek zamanlı pazarlamada örnek vaka."
      },
      "en": {
        "insight": "After Trabzonspor's championship, people queuing at ATMs in Trabzon created a brand moment.",
        "idea": "ING ATM activation that instantly stood out in Trabzon during intense championship celebrations.",
        "execution": "ATM animations and surprise experiences celebrating Trabzonspor's championship. Went viral on social media.",
        "result": "Felis 2022 Grand Prix. Record ING brand love in Trabzon. Textbook case in real-time marketing."
      }
    }
  },
  {
    "title": "Vodafone Arena — Çok Bekledik Be Abi",
    "brand": "Vodafone Arena",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2016,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Integrated",
    "labels": ["Türkiye", "Spor", "Stadyum", "Beşiktaş", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Beşiktaş taraftarları yeni stadyum için yıllarca bekledi — bu beklentinin duygusal birikimi kampanyaya güç katabilir.",
        "idea": "Vodafone Arena'nın açılışını Beşiktaş taraftarlarının samimi 'Çok bekledik be abi' tepkisiyle kutlayan kampanya.",
        "execution": "Taraftarların gerçek heyecan anlarını yakalayan film ve dijital içerikler. Sosyal medyada organik viral yayılım.",
        "result": "Kristal Elma 2016 Grand Prix. Tribal Istanbul tarihinin en önemli ödüllerinden biri. Kültürel bir anı reklama dönüştürmenin mükemmel örneği."
      },
      "en": {
        "insight": "Beşiktaş fans waited years for their new stadium — the emotional buildup of that wait could power a campaign.",
        "idea": "Campaign celebrating Vodafone Arena's opening with the authentic fan reaction: 'We waited so long, bro.'",
        "execution": "Film and digital content capturing real fan excitement moments. Organic viral spread on social media.",
        "result": "Kristal Elma 2016 Grand Prix. One of Tribal Istanbul's most important ever awards. Perfect example of turning a cultural moment into advertising."
      }
    }
  },
  {
    "title": "Audi — Hava Yastığı (Cennet & Cehennem)",
    "brand": "Audi",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2015,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Basın",
    "labels": ["Türkiye", "Otomotiv", "Basın", "Yaratıcı", "Tribal", "Kristal Elma", "Cannes"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Hava yastığı hayat kurtarır — bunu göstermenin en çarpıcı yolu, olmadığı durumu hayal ettirmektir.",
        "idea": "İki ilan: birinde hava yastığı açılıyor ve sürücü cennete gidiyor, diğerinde açılmıyor ve cehenneme. Audi'nin güvenlik teknolojisini ölüm-kalım diliyle anlatan press ilanı.",
        "execution": "Yüksek sanat yönetimiyle hazırlanmış iki ilanın basında yayınlanması. Cannes Lions shortlist dahil 15+ uluslararası yarışmada ödül.",
        "result": "Kristal Elma 2015 Grand Prix (Basın Büyük Ödül). Kırmızı 2016 Grand Prix. Audi'nin en ödüllü Türkiye reklamı. Tribal Istanbul'un uluslararası alanda tanındığı dönüm noktası iş."
      },
      "en": {
        "insight": "An airbag saves lives — the most striking way to show this is to make people imagine life without it.",
        "idea": "Two ads: in one the airbag deploys and the driver goes to heaven, in the other it doesn't and he goes to hell. A press ad communicating Audi's safety technology in life-or-death terms.",
        "execution": "Two ads with high art direction published in press. Won awards at 15+ international competitions including Cannes Lions shortlist.",
        "result": "Kristal Elma 2015 Grand Prix (Press Grand Prize). Kırmızı 2016 Grand Prix. Audi's most awarded Turkey ad. Turning point work for Tribal Istanbul's international recognition."
      }
    }
  },
  {
    "title": "Doritos Akademi",
    "brand": "Frito Lay / Doritos",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2012,
    "competition": "Mediacat Felis Ödülleri",
    "level": "Grand Prix",
    "category": "Dijital",
    "labels": ["Türkiye", "Gıda", "Gençlik", "Dijital", "Oyun", "Tribal", "Felis"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Genç tüketiciler marka içeriğinin bir parçası olmak istiyor — katılımcı deneyimler markayla duygusal bağ kurar.",
        "idea": "Gençleri Doritos'un reklam ajansına dönüştüren interaktif dijital platform: Doritos Akademi.",
        "execution": "Online platform: gençler video içerik üretti, yarıştı ve en iyi içerik ödüllendirildi. UGC + gamification.",
        "result": "Felis 2012 Grand Prix. Dönemin en yenilikçi dijital kampanyalarından biri. Tribal Istanbul'un dijital öncülüğünü kanıtladı."
      },
      "en": {
        "insight": "Young consumers want to be part of brand content — participatory experiences build emotional brand connection.",
        "idea": "Interactive digital platform turning young people into Doritos' own ad agency: Doritos Academy.",
        "execution": "Online platform where young people produced video content, competed, and the best content was rewarded. UGC + gamification.",
        "result": "Felis 2012 Grand Prix. One of the most innovative digital campaigns of its era. Proved Tribal Istanbul's digital leadership."
      }
    }
  },

  # ── KRİSTAL SEVİYE (TOP ÖDÜLLER 2020-2025) ───────────────────────────────
  {
    "title": "Koç — Eser",
    "brand": "Koç",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Film / Entegre",
    "labels": ["Türkiye", "Kurumsal", "Film", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Koç'un kurucu mirası yeni nesle kişisel ve duygusal bir dille aktarılabilir.",
        "idea": "Vehbi Koç'un hayatından ilham alan, Türkiye'nin gelişimine katkıyı anlatan kurumsal film.",
        "execution": "Yüksek prodüksiyon değerine sahip sinema kalitesinde film. Film, Basın, Entegre ve Medya kategorilerinde Kristal kazandı.",
        "result": "Kristal Elma 2025'te 4 ayrı kategoride Kristal Ödül. Tribal Istanbul'un 2025 yılının en ödüllü işi."
      },
      "en": {
        "insight": "Koç's founding heritage can be communicated to the new generation in a personal and emotional language.",
        "idea": "Corporate film inspired by Vehbi Koç's life, telling the story of contribution to Turkey's development.",
        "execution": "Cinema-quality film with high production values. Won Kristal in Film, Press, Integrated and Media categories.",
        "result": "4 Kristal Awards at Kristal Elma 2025 across separate categories. Tribal Istanbul's most awarded work of 2025."
      }
    }
  },
  {
    "title": "Turkish Airlines — The Oldest Bread",
    "brand": "Turkish Airlines",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Ambient / Entegre",
    "labels": ["Türkiye", "Havacılık", "Kültür", "Ambient", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Türkiye dünyanın en eski ekmek kültürüne ev sahipliği yapıyor — bu kültürel köklülük THY'nin küresel konumlandırmasını güçlendirebilir.",
        "idea": "Dünyanın en eski ekmeğini (12.000 yıllık Çatalhöyük bulguru ekmeği) Turkish Airlines ile dünyaya tanıştıran ambient kampanya.",
        "execution": "Uçaklarda ve havalimanlarında ekmek servis edildi. Global PR ile desteklendi. Kristal Elma'da Ambient ve Entegre Kristal kazandı.",
        "result": "Kristal Elma 2025 Kristal Ödülü (Ambient + Entegre). Küresel medyada geniş yer buldu. Kültürel miras ile modern havacılığı buluşturan çarpıcı iş."
      },
      "en": {
        "insight": "Turkey is home to the world's oldest bread culture — this cultural depth can reinforce THY's global positioning.",
        "idea": "Ambient campaign introducing the world's oldest bread (12,000-year-old Çatalhöyük recipe) via Turkish Airlines.",
        "execution": "Bread served on flights and in airports. Supported with global PR. Won Kristal in Ambient and Integrated at Kristal Elma.",
        "result": "Kristal Elma 2025 Kristal Award (Ambient + Integrated). Wide coverage in global media. Striking work fusing cultural heritage with modern aviation."
      }
    }
  },
  {
    "title": "Turkcell — Geleceği Yazanlar Yapay Zeka",
    "brand": "Turkcell",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Film / Entegre / Radyo",
    "labels": ["Türkiye", "Telekom", "Yapay Zeka", "Film", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Yapay zeka gençlerin geleceğini şekillendirecek — Turkcell bu dönüşümün öncüsü konumunu sahiplenebilir.",
        "idea": "Turkcell'in yapay zeka eğitim girişimini gençlerin perspektifinden anlatan çok kanallı kampanya.",
        "execution": "Film, online film, basın ve radyo kategorilerinde Kristal. 360 derece medya stratejisi.",
        "result": "Kristal Elma 2025'te Film, Online Film, Basın ve Radyo kategorilerinde Kristal. Tribal Istanbul'un çok ödüllü kampanyası."
      },
      "en": {
        "insight": "AI will shape the future of young people — Turkcell can own the position of pioneer of this transformation.",
        "idea": "Multi-channel campaign telling the story of Turkcell's AI education initiative from young people's perspective.",
        "execution": "Kristal across Film, Online Film, Press and Radio categories. 360-degree media strategy.",
        "result": "Kristal across Film, Online Film, Press and Radio categories at Kristal Elma 2025. Tribal Istanbul's multi-award campaign."
      }
    }
  },
  {
    "title": "Netflix — Squid Game Pink Guard'lar İstanbul'u Ele Geçirdi",
    "brand": "Netflix",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Ambient / Medya",
    "labels": ["Türkiye", "Medya", "Aktivasyon", "Squid Game", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Squid Game 2. sezon lansmanı için global dikkat çekmek gerek — İstanbul'un ikonik mekanları mükemmel bir sahne.",
        "idea": "Squid Game karakterlerini İstanbul metrosuna ve şehir meydanlarına taşıyan sürpriz aktivasyon.",
        "execution": "İstanbul metrosunda Pink Guard'lar aniden belirdi. Spontan sosyal medya içeriği viral oldu. Entegre Gümüş + Medya Kristal + Ambient Büyük Gümüş.",
        "result": "Kristal Elma 2025'te birden fazla kategoride ödül. Global Netflix sosyal medyasında yer aldı. Şehrin kendisini mecra olarak kullanan cesur aktivasyon."
      },
      "en": {
        "insight": "The Squid Game Season 2 launch needed global attention — Istanbul's iconic locations are a perfect stage.",
        "idea": "Surprise activation bringing Squid Game characters to Istanbul metro and city squares.",
        "execution": "Pink Guards suddenly appeared in Istanbul metro. Spontaneous social media content went viral. Integrated Silver + Media Kristal + Ambient Large Silver.",
        "result": "Multiple awards at Kristal Elma 2025. Featured on global Netflix social media. Bold activation using the city itself as the medium."
      }
    }
  },
  {
    "title": "Boyner — Küçüğün Rızası",
    "brand": "Boyner",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Film / Sosyal Sorumluluk",
    "labels": ["Türkiye", "Perakende", "Çocuk Hakları", "Sosyal Sorumluluk", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Çocukların sosyal medya içeriklerinde rızaları olmadan yer alması büyük bir sorun — bir marka bu sessizliği bozabilir.",
        "idea": "Çocukların sosyal medyada aileleri tarafından rızasız paylaşılmasının sakıncalarını anlatan güçlü film.",
        "execution": "Duygusal film ve dijital kampanya. Sosyal medya etiketi ile kullanıcı farkındalığı artırıldı.",
        "result": "Kristal Elma 2024 Kristal (Film / Sosyal Sorumluluk). Sosyal medyada geniş yankı. Çocuk hakları alanında farkındalık yaratan landmark iş."
      },
      "en": {
        "insight": "Children being featured in social media content without consent is a major problem — a brand can break this silence.",
        "idea": "Powerful film telling the dangers of parents sharing children on social media without their consent.",
        "execution": "Emotional film and digital campaign. Social media hashtag raised user awareness.",
        "result": "Kristal Elma 2024 Kristal (Film / Social Responsibility). Wide social media resonance. Landmark work raising awareness in children's rights."
      }
    }
  },
  {
    "title": "ŞOK — Barbie ŞOK'ta",
    "brand": "ŞOK Market",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Basın",
    "labels": ["Türkiye", "Perakende", "Gündeme Katılım", "Barbie", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Barbie filminin global çılgınlığı tüm markalara fırsat sundu — ŞOK bu fırsatı basit ve zekice bir ilanla değerlendirebildi.",
        "idea": "Barbie filminin pembe furyasında ŞOK'un pembe kurumsal rengini kullanan akıllıca basın ilanı: 'Barbie ŞOK'ta'.",
        "execution": "Tek sayfalık basın ilanı. Pembe renk ve Barbie kültürüyle ŞOK'un doğal bağlantısı kuruldu. Düşük maliyetle maksimum etki.",
        "result": "Kristal Elma 2025 Kristal (Basın + Basın Kampanyası). Viral sosyal medya içeriğine dönüştü. En az bütçeyle en fazla etki yaratan Tribal işi."
      },
      "en": {
        "insight": "The Barbie film's global craze offered opportunity to all brands — ŞOK seized it with a simple, clever ad.",
        "idea": "Smart press ad using ŞOK's own pink corporate color in the Barbie film's pink frenzy: 'Barbie is at ŞOK'.",
        "execution": "Single-page press ad. Natural connection built between ŞOK's pink and Barbie culture. Maximum impact, minimum cost.",
        "result": "Kristal Elma 2025 Kristal (Press + Press Campaign). Turned into viral social media content. Tribal's highest-impact lowest-budget work."
      }
    }
  },
  {
    "title": "ING — Bitmeyen Hoş Geldin Faizi",
    "brand": "ING Türkiye",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Radyo ve Ses",
    "labels": ["Türkiye", "Finans", "Radyo", "Yaratıcı", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Bankacılık ürünlerini radyoda anlatmak sıkıcı olmak zorunda değil — ses tasarımıyla ürünün özellikleri eğlenceli bir deneyime dönüşebilir.",
        "idea": "ING'nin sürekli uzayan hoş geldin faizini 'bitmek bilmeyen' sesli bir deneyime dönüştüren radyo kampanyası.",
        "execution": "Sürekli uzayan, bitmek bilmeyen sesli reklam formatı. Dinleyiciyi güldürürken ürünü net anlatıyor.",
        "result": "Kristal Elma 2025 Kristal (Radyo ve Ses). Radyo mecrasında yaratıcılığın sınırlarını zorlayan örnek çalışma."
      },
      "en": {
        "insight": "Communicating banking products on radio doesn't have to be boring — sound design can turn product features into a fun experience.",
        "idea": "Radio campaign turning ING's ever-extending welcome interest rate into an 'endless' audio experience.",
        "execution": "Continuously extending, never-ending audio ad format. Makes listeners laugh while clearly communicating the product.",
        "result": "Kristal Elma 2025 Kristal (Radio & Sound). Example work pushing the creative limits of the radio medium."
      }
    }
  },
  {
    "title": "TEMA — Buralar Eskiden…",
    "brand": "TEMA Vakfı",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Dijital / OOH",
    "labels": ["Türkiye", "Çevre", "Doğa", "Sosyal Sorumluluk", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "İnsanlar çevre tahribatını soyut istatistiklerle değil, kendi kişisel hafızalarındaki değişimle hissedebilirler.",
        "idea": "Türkiye'nin eski doğal güzelliklerini bugünkü görüntülerle karşılaştıran 'Buralar Eskiden…' dijital ve açıkhava kampanyası.",
        "execution": "Fotoğraf arşivleri ile bugünün görüntüleri yan yana konuldu. Dijital ve OOH mecralarda yayınlandı.",
        "result": "Kristal Elma 2025 Kristal (Dijital + Açıkhava). Doğa koruma farkındalığında kayda değer artış. Duygusal ve veri odaklı mükemmel denge."
      },
      "en": {
        "insight": "People can feel environmental degradation not through abstract statistics, but through changes in their personal memories.",
        "idea": "Digital and outdoor campaign 'This Used to Be…' comparing Turkey's former natural beauty with current images.",
        "execution": "Photo archives placed side by side with current images. Published across digital and OOH channels.",
        "result": "Kristal Elma 2025 Kristal (Digital + OOH). Significant increase in nature conservation awareness. Perfect balance of emotional and data-driven."
      }
    }
  },
  {
    "title": "Algida — Kalp (Bamya)",
    "brand": "Algida",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2022,
    "competition": "Kristal Elma",
    "level": "Kristal",
    "category": "Basın",
    "labels": ["Türkiye", "Gıda", "Dondurma", "Basın", "Yaratıcı", "Tribal", "Kristal Elma"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Algida'nın kalp logosu yıllarca akıllarda. Bu logoyu beklenmedik bağlamlarda görmek sürpriz yaratır.",
        "idea": "Algida'nın ikonik kalp logosunu bamya gibi beklenmedik gıdalarda keşfeden basın ilanı serisi.",
        "execution": "Gerçek gıdalardan oluşturulan kalp şekilleri fotoğraflandı. Baskı kalitesi ve sanat yönetimiyle dikkat çekici.",
        "result": "Kristal Elma 2022 Kristal (Basın Sektörel Hızlı Tüketim + Basın Kampanyası). Basın yaratıcılığında en üst ödül."
      },
      "en": {
        "insight": "Algida's heart logo has been in people's minds for years. Seeing this logo in unexpected contexts creates surprise.",
        "idea": "Press ad series discovering Algida's iconic heart logo in unexpected foods like okra.",
        "execution": "Heart shapes formed from real foods were photographed. Attention-grabbing for print quality and art direction.",
        "result": "Kristal Elma 2022 Kristal (Press Sectoral FMCG + Press Campaign). Top award in press creativity."
      }
    }
  },

  # ── NOTABLE CANNES / INTERNATIONAL ────────────────────────────────────────
  {
    "title": "Audi — Intelligent Airbag System (Heaven & Hell)",
    "brand": "Audi",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2015,
    "competition": "Cannes Lions",
    "level": "Shortlist",
    "category": "Outdoor / Print",
    "labels": ["Türkiye", "Otomotiv", "Cannes", "Basın", "Tribal", "Uluslararası"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "Hava yastığı güvenlik teknolojisi için en güçlü mesaj: olmadığında ne olur?",
        "idea": "Cennet ve Cehennem metaforuyla Audi'nin akıllı hava yastığı sistemini anlatan basın ilanı.",
        "execution": "İki ilan: Hava yastığı açılıyor → Cennet. Hava yastığı açılmıyor → Cehennem. Cannes Lions shortlist.",
        "result": "Cannes Lions 2015 Shortlist (Outdoor & Print). Tribal Istanbul'un ilk Cannes shortlist başarısı."
      },
      "en": {
        "insight": "The most powerful message for airbag safety technology: what happens without it?",
        "idea": "Press ad explaining Audi's intelligent airbag system through the Heaven and Hell metaphor.",
        "execution": "Two ads: Airbag deploys → Heaven. Airbag doesn't deploy → Hell. Cannes Lions shortlist.",
        "result": "Cannes Lions 2015 Shortlist (Outdoor & Print). Tribal Istanbul's first Cannes shortlist achievement."
      }
    }
  },
  {
    "title": "Altılı Ganyan — Atları Tutkuyla Sevenler",
    "brand": "Altılı Ganyan",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Effie Awards",
    "level": "Gold",
    "category": "Diğer Hizmet",
    "labels": ["Türkiye", "At Yarışı", "Spor", "Effie", "Tribal"],
    "videoUrl": None,
    "imageUrl": None,
    "tribal": True,
    "content": {
      "tr": {
        "insight": "At yarışı kültürü Türkiye'de köklü ama genç nesle hitap etmekte zorlanıyor.",
        "idea": "At yarışını tutkulu bir hobi olarak yeniden konumlandıran, gerçek taraftarların hikayelerini anlatan kampanya.",
        "execution": "Otantik at tutkunu profilleri üzerine kurulu içerik serisi. Dijital ve sosyal medya yayılımı.",
        "result": "Effie Awards 2025 Gümüş Effie. Curious Felis 2024 Altın. Hedef kitleye ulaşmada ve satışlarda ölçülebilir artış."
      },
      "en": {
        "insight": "Horse racing culture has deep roots in Turkey but struggles to appeal to the younger generation.",
        "idea": "Campaign repositioning horse racing as a passionate hobby, telling the stories of real fans.",
        "execution": "Content series built around authentic horse enthusiast profiles. Digital and social media spread.",
        "result": "Effie Awards 2025 Silver Effie. Curious Felis 2024 Gold. Measurable increase in target audience reach and sales."
      }
    }
  },
]

def main():
    print(f"Seeding {len(TRIBAL_AWARDS)} Tribal awards...")
    ok, fail = 0, 0
    for i, award in enumerate(TRIBAL_AWARDS):
        doc_id = add_doc("awards", award)
        status = "OK" if doc_id else "FAIL"
        print(f"  [{i+1}/{len(TRIBAL_AWARDS)}] {status}: {award['title'][:60]}")
        if doc_id: ok += 1
        else: fail += 1
        time.sleep(0.05)
    print(f"\nDone: {ok} inserted, {fail} failed")

if __name__ == "__main__":
    main()
