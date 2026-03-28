#!/usr/bin/env python3
"""Seed Tribal İlham Arşivi — awards collection via Firestore REST API"""
import json, urllib.request, urllib.error, time, os

PROJECT_ID = "agency-planing"

# Read Firebase CLI token
config_path = os.path.expanduser("~/.config/configstore/firebase-tools.json")
with open(config_path) as f:
    config = json.load(f)
tokens = config.get("tokens", {})
TOKEN = tokens.get("access_token") or tokens.get("refresh_token", "")
if not TOKEN:
    raise SystemExit("No access token found in firebase-tools.json")

BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

def firestore_value(v):
    if v is None:
        return {"nullValue": None}
    if isinstance(v, bool):
        return {"booleanValue": v}
    if isinstance(v, int):
        return {"integerValue": str(v)}
    if isinstance(v, float):
        return {"doubleValue": v}
    if isinstance(v, list):
        return {"arrayValue": {"values": [firestore_value(i) for i in v]}}
    if isinstance(v, dict):
        return {"mapValue": {"fields": {k: firestore_value(vv) for k, vv in v.items()}}}
    return {"stringValue": str(v)}

def to_firestore_doc(data):
    return {"fields": {k: firestore_value(v) for k, v in data.items()}}

def add_document(collection, data):
    url = f"{BASE_URL}/{collection}"
    body = json.dumps(to_firestore_doc(data)).encode()
    req = urllib.request.Request(url, data=body, method="POST",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            name = result.get("name", "").split("/")[-1]
            return name
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code}: {e.read().decode()[:200]}")
        return None

AWARDS = [
  # ─── CANNES LIONS 2025 GRAND PRIX ───────────────────────────────────────────
  {
    "title": "The Misheard Version",
    "brand": "Specsavers",
    "agency": "Golin / Specsavers Creative",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "PR",
    "labels": ["Humor", "Brand Comedy", "Hearing", "Health", "Global"],
    "videoUrl": "https://www.youtube.com/watch?v=6gukKpJaSF8",
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "İnsanlar şarkı sözlerini yanlış duyduklarında bunu paylaşmaktan keyif alırlar — bu evrensel bir insan deneyimidir.",
        "idea": "Specsavers, Rick Astley'nin 'Never Gonna Give You Up' parçasını yanlış duyulan sözlerle yeniden kayıt ettirdi. İşitme kaybının farkındalığını mizahi bir kültür anıyla birleştirdi.",
        "execution": "Rick Astley ile iş birliği yapıldı. Şarkının yanlış duyulan versiyonu sosyal medyada viral oldu ve medyada büyük yankı uyandırdı.",
        "result": "Milyarlarca medya erişimi. İşitme testi yaptıranların sayısında kayda değer artış. Cannes'da PR Grand Prix kazandı."
      },
      "en": {
        "insight": "People love sharing the funny ways they mishear song lyrics — it's a universally relatable human experience.",
        "idea": "Specsavers had Rick Astley re-record 'Never Gonna Give You Up' with misheard lyrics, turning a cultural moment into a hearing health message.",
        "execution": "Partnered with Rick Astley, released the misheard version on social media. The campaign went viral globally.",
        "result": "Billions of media impressions. Significant increase in hearing test bookings. Grand Prix winner at Cannes Lions 2025."
      }
    }
  },
  {
    "title": "Reframe",
    "brand": "IKEA",
    "agency": "Åkestam Holst / NoA",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Social & Influencer",
    "labels": ["Interior Design", "Social Media", "Influencer", "Home", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "IKEA ürünleri zaten pek çok evde var — onları yeniden çerçevelemek yeni bir satın alma isteği yaratır.",
        "idea": "İnsanlara evinizde zaten sahip olduğunuz IKEA ürünlerini influencer fotoğrafları gibi yeniden çekmeleri için ilham veren bir kampanya.",
        "execution": "UGC odaklı kampanya — kullanıcılar sahip oldukları ürünleri estetik fotoğraflarla paylaştı. Platform: Instagram ve TikTok.",
        "result": "Sosyal medyada milyonlarca paylaşım. Ürün algısında olumlu değişim. Social & Influencer kategorisinde Grand Prix."
      },
      "en": {
        "insight": "IKEA products already live in millions of homes — reframing them creates desire without needing new products.",
        "idea": "Inspiring people to photograph IKEA items they already own as if they were influencer content.",
        "execution": "UGC-driven campaign on Instagram and TikTok. Users shared their own IKEA setups with fresh aesthetic framing.",
        "result": "Millions of social shares. Positive shift in brand perception. Grand Prix in Social & Influencer at Cannes 2025."
      }
    }
  },
  {
    "title": "Dream Crazy / Long Live Dreams",
    "brand": "Nike",
    "agency": "Wieden+Kennedy Portland",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Film",
    "labels": ["Sport", "Inspiration", "Film", "Storytelling", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Büyük hayaller kurmak cesaret ister — Nike bu cesareti besler.",
        "idea": "Sporculara 'deli gibi hayal kur' mesajı veren duygusal film serisi. Sıradan insanların olağanüstü hikayelerini anlatan bir anlatı.",
        "execution": "Yüksek prodüksiyonlu film, televizyon ve dijital platformlarda yayınlandı. Ünlü sporcular ve genç yetenekler bir arada.",
        "result": "Film kategorisinde Grand Prix. Global medyada büyük yankı. Marka sevgisinde artış."
      },
      "en": {
        "insight": "Dreaming big takes courage — Nike fuels that courage.",
        "idea": "Emotional film series telling the stories of athletes who dared to dream crazy dreams.",
        "execution": "High-production film aired on TV and digital platforms, featuring both famous athletes and emerging talent.",
        "result": "Grand Prix in Film at Cannes 2025. Massive global press coverage. Brand love increase."
      }
    }
  },
  {
    "title": "Uncommon Goods",
    "brand": "Uncommon Goods",
    "agency": "In-house",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Direct",
    "labels": ["E-commerce", "Personalization", "Direct", "Retail", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "İnsanlar hediye almakta zorlanır — doğru rehberlik satın alma kararını kolaylaştırır.",
        "idea": "Kişiselleştirilmiş hediye öneri sistemi: alıcının değerlerine ve ilgi alanlarına göre özelleştirilmiş hediye listesi.",
        "execution": "E-posta ve dijital kanal entegrasyonu. Veriye dayalı öneri motoru. Her kullanıcıya özel içerik.",
        "result": "Direct kategorisinde Grand Prix. Dönüşüm oranlarında büyük artış. Müşteri memnuniyetinde rekor."
      },
      "en": {
        "insight": "Gift-giving is hard — the right guidance removes friction and drives purchase.",
        "idea": "Hyper-personalized gift recommendation system matching gifts to recipient values and interests.",
        "execution": "Email and digital channel integration with data-driven recommendation engine, personalized for each user.",
        "result": "Grand Prix in Direct at Cannes 2025. Large conversion rate uplift. Record customer satisfaction."
      }
    }
  },
  {
    "title": "The Everyday Tactician",
    "brand": "Microsoft Xbox",
    "agency": "McCann London",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Entertainment",
    "labels": ["Gaming", "AI", "Entertainment", "Innovation", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Oyuncular gerçek hayattaki taktik becerilerini kullanarak oyun dünyasında da başarılı olabilirler.",
        "idea": "Gerçek bir futbol kulübüne bir FIFA oyuncusunu taktik direktörü yapan deneyimsel kampanya.",
        "execution": "Bir Xbox oyuncusu League One kulübünde gerçek maçlar için taktik hazırladı. Belgesel formatında içerik üretildi.",
        "result": "Entertainment kategorisinde Grand Prix. Küresel medya kapsamı. Oyun ve futbol dünyasını buluşturan ikonik an."
      },
      "en": {
        "insight": "Gamers develop real tactical skills — those skills translate to real-world success.",
        "idea": "Experiential campaign making a FIFA gamer the tactical director of a real football club.",
        "execution": "An Xbox gamer prepared tactics for real matches at a League One club. Content produced in documentary format.",
        "result": "Grand Prix in Entertainment at Cannes 2025. Global press. Iconic fusion of gaming and football worlds."
      }
    }
  },
  {
    "title": "Cashless Sweden",
    "brand": "SEB Bank",
    "agency": "Edelman Stockholm",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Creative Data",
    "labels": ["FinTech", "Data", "Social Cause", "Sweden", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "İsveç en nakit kullanmayan ülkelerden biri — bu durum bir ekonomik dışlanma riski yaratıyor.",
        "idea": "Nakit kullanmayan toplumun dezavantajlı gruplara (yaşlılar, göçmenler) etkisini görünür kılan veri odaklı kampanya.",
        "execution": "Gerçek verilerle hazırlanmış etkileşimli bir deneyim. Medya ve politika yapıcıları kapsayıcı bir finansal sisteme yönlendirdi.",
        "result": "Creative Data kategorisinde Grand Prix. Politika değişikliklerine katkı. Sosyal etki odaklı bir marka konumlandırması."
      },
      "en": {
        "insight": "Sweden is one of the most cashless societies — this creates real risks of financial exclusion for vulnerable groups.",
        "idea": "Data-driven campaign making visible the impact of cashlessness on the elderly, immigrants and marginalized groups.",
        "execution": "Interactive experience built on real data, directing media and policymakers toward a more inclusive financial system.",
        "result": "Grand Prix in Creative Data. Contribution to policy changes. Purpose-driven brand positioning."
      }
    }
  },
  {
    "title": "Pedigree Adoptable",
    "brand": "Pedigree",
    "agency": "Colenso BBDO",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Creative Technology",
    "labels": ["AI", "Pets", "Social Cause", "Technology", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Hayvan barınaklarındaki köpekler çoğunlukla kötü fotoğraflarla temsil edildiği için sahiplenilemiyor.",
        "idea": "AI ile barınak köpeklerinin fotoğraflarını iyileştiren ve onları daha çekici gösteren bir teknoloji çözümü.",
        "execution": "Generative AI kullanılarak her köpeğin en iyi versiyonu ortaya çıkarıldı. Sahiplenme platformlarına entegre edildi.",
        "result": "Creative Technology Grand Prix. Sahiplenme oranlarında belgelenmiş artış. Cannes'ın en duygusal işlerinden biri."
      },
      "en": {
        "insight": "Shelter dogs often go unadopted because they're represented with poor-quality photos.",
        "idea": "AI technology that enhances shelter dog photos, making them more appealing to potential adopters.",
        "execution": "Generative AI used to produce the best version of each dog's photo, integrated into adoption platforms.",
        "result": "Creative Technology Grand Prix. Documented increase in adoption rates. One of Cannes' most emotional campaigns."
      }
    }
  },
  {
    "title": "Wren — 1000 Castaways",
    "brand": "Wren",
    "agency": "Wren (in-house)",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Sustainable Development Goals",
    "labels": ["Climate", "Environment", "Social Cause", "Storytelling", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "İklim değişikliğini soyut bir şekilde anlatmak insanları harekete geçirmiyor — kişisel hikayeler daha güçlü.",
        "idea": "1000 kişiyi gerçek hayat senaryolarında iklim değişikliğinin etkilerini deneyimlettiren kampanya.",
        "execution": "Sosyal deney formatında video sürüsü. Katılımcılar iklimin kişisel etkisini yaşadı. Wren karbon telafi hizmetini tanıttı.",
        "result": "SDG kategorisinde Grand Prix. Abonelik artışı. İklim eyleminde farkındalık artışı."
      },
      "en": {
        "insight": "Abstract climate messaging doesn't move people — personal stories do.",
        "idea": "A campaign putting 1000 people in real-life scenarios to experience the personal effects of climate change.",
        "execution": "Social experiment video series. Participants lived the personal impact of climate. Wren's carbon offset service featured.",
        "result": "Grand Prix in SDGs. Subscription growth. Awareness increase for climate action."
      }
    }
  },
  {
    "title": "Blood Pressure Beats",
    "brand": "Hypertension Canada",
    "agency": "FCB Canada",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Health & Wellness",
    "labels": ["Health", "Music", "Technology", "Social Cause", "Canada"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Yüksek tansiyon sessiz bir katil — çoğu insan belirtileri fark etmeden yaşamaya devam eder.",
        "idea": "Müzik ritimlerini kullanarak kan basıncı ölçümünü erişilebilir ve eğlenceli hale getiren bir sağlık kampanyası.",
        "execution": "Müzik uygulamaları ile entegrasyon. Kullanıcılar şarkı dinlerken kan basınçlarını ölçebildi.",
        "result": "Health & Wellness Grand Prix. Ölçüm sayısında büyük artış. Dijital sağlık alanında yenilikçi model."
      },
      "en": {
        "insight": "Hypertension is a silent killer — most people live with it without noticing symptoms.",
        "idea": "Using music rhythms to make blood pressure monitoring accessible and engaging.",
        "execution": "Integration with music apps. Users could measure blood pressure while listening to songs.",
        "result": "Grand Prix in Health & Wellness. Large increase in measurements. Innovative model for digital health."
      }
    }
  },
  {
    "title": "Responsible Fishing",
    "brand": "WWF",
    "agency": "DDB Helsinki",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Outdoor",
    "labels": ["Environment", "OOH", "Social Cause", "Nature", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Sürdürülebilir balıkçılığın mesajı, balıkçıların bulunduğu ortamlarda en güçlü etkiyi yaratır.",
        "idea": "Balıkçı bölgelerinde ve limanlarda görünür olan outdoor görseller — doğrudan hedef kitleye.",
        "execution": "Stratejik OOH placements. Balıkçı tekneleri, liman duvarları ve nehir kıyılarında çarpıcı görseller.",
        "result": "Outdoor Grand Prix. Sürdürülebilir balıkçılık farkındalığında artış. Çevresel medya erişimi."
      },
      "en": {
        "insight": "The sustainable fishing message lands hardest in the very environments where fishing happens.",
        "idea": "Outdoor visuals visible in fishing areas and harbors — speaking directly to the target audience.",
        "execution": "Strategic OOH placements on fishing boats, harbor walls and riverside locations.",
        "result": "Grand Prix in Outdoor. Increase in sustainable fishing awareness. Strong environmental media reach."
      }
    }
  },
  {
    "title": "OREO: Most Stuf",
    "brand": "OREO",
    "agency": "The Martin Agency",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Brand Experience & Activation",
    "labels": ["Food", "Brand Experience", "Humor", "Fan Engagement", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "OREO fanları arasında krem miktarı tartışması bir kültür anıdır — marka bu anı sahiplenebilir.",
        "idea": "En fazla krem içeren OREO'yu bulmak için düzenlenen interaktif bir deneyim ve yarışma.",
        "execution": "Pop-up aktivasyonlar, dijital etkileşim, sınırlı üretim ürünler. Fanlar deneyime dahil edildi.",
        "result": "Brand Experience Grand Prix. Büyük sosyal medya yankısı. Ürün merakında ve satışlarda artış."
      },
      "en": {
        "insight": "The debate over OREO cream filling is a cultural moment — the brand can own it.",
        "idea": "Interactive experience and competition to find the OREO with the most creme.",
        "execution": "Pop-up activations, digital engagement, limited-edition products. Fans were part of the experience.",
        "result": "Grand Prix in Brand Experience. Massive social media echo. Increase in product curiosity and sales."
      }
    }
  },
  {
    "title": "The Last Performance",
    "brand": "Alzheimer's Research UK",
    "agency": "Ogilvy UK",
    "year": 2025,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Film Craft",
    "labels": ["Health", "Emotion", "Film", "Storytelling", "UK"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Alzheimer hastalığı kişiyi parça parça götürür — aile üyelerinin acısı çoğunlukla görünmezdir.",
        "idea": "Bir tiyatro oyuncusunun Alzheimer'ın ilerlemesiyle sahnesini kaybettiği duygusal kısa film.",
        "execution": "Sinema kalitesinde kısa film. Gerçek Alzheimer hastaları ve aileleriyle iş birliği yapıldı.",
        "result": "Film Craft Grand Prix. Bağış toplamada rekor. En duygusal Cannes filmlerinden biri."
      },
      "en": {
        "insight": "Alzheimer's takes a person piece by piece — the grief of family members is often invisible.",
        "idea": "An emotional short film following a theater actor losing their stage as Alzheimer's progresses.",
        "execution": "Cinema-quality short film, created in collaboration with real Alzheimer's patients and families.",
        "result": "Grand Prix in Film Craft. Record fundraising. One of the most emotional films at Cannes."
      }
    }
  },
  # ─── CANNES LIONS 2024 GRAND PRIX ───────────────────────────────────────────
  {
    "title": "Wish You Were Here",
    "brand": "Bloomberg Media",
    "agency": "Bloomberg Creative",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Print & Publishing",
    "labels": ["Media", "Climate", "Data Visualization", "Print", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "İklim değişikliği verileri soyut kalıyor — görsel gazetecilik gerçekliği daha çarpıcı hale getirebilir.",
        "idea": "Dünyanın ikonik tatil destinasyonlarını iklim değişikliği verileriyle birleştiren dergi kapakları.",
        "execution": "Bloomberg Businessweek'te yayınlanan kapaklar — eriyen buzullar, kuruyan göller, batan şehirler.",
        "result": "Print Grand Prix. Sosyal medyada viral yayılım. İklim farkındalığı üzerine büyük basın ilgisi."
      },
      "en": {
        "insight": "Climate data remains abstract — visual journalism can make the reality more striking.",
        "idea": "Magazine covers combining iconic travel destinations with climate change data.",
        "execution": "Covers published in Bloomberg Businessweek — melting glaciers, drying lakes, sinking cities.",
        "result": "Grand Prix in Print. Viral spread on social media. Major press attention on climate awareness."
      }
    }
  },
  {
    "title": "Renovation for Good",
    "brand": "Dove",
    "agency": "Ogilvy",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Social & Influencer",
    "labels": ["Beauty", "Social Cause", "Inclusion", "Women", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Kadınlar sosyal medyadaki gerçek dışı güzellik standartlarından olumsuz etkileniyor.",
        "idea": "Instagram'ı daha gerçekçi ve kapsayıcı bir platform haline getirmek için algoritmayı değiştirmeye yönelik sosyal kampanya.",
        "execution": "Influencer'ların #NoDigitalDistortion etiketi ile filtresiz içerik paylaşması. Platform politikası değişikliği için lobi.",
        "result": "Social & Influencer Grand Prix. Milyonlarca katılım. Gerçek güzellik standardı tartışmasının yeniden alevlenmesi."
      },
      "en": {
        "insight": "Women are negatively affected by unrealistic beauty standards on social media.",
        "idea": "Social campaign aimed at changing the algorithm to make Instagram a more realistic and inclusive platform.",
        "execution": "Influencers sharing unfiltered content with #NoDigitalDistortion. Lobbying for platform policy change.",
        "result": "Grand Prix in Social & Influencer. Millions of engagements. Re-ignited the real beauty standards conversation."
      }
    }
  },
  {
    "title": "MaisonSport x Decathlon",
    "brand": "Decathlon",
    "agency": "BETC Paris",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Brand Experience & Activation",
    "labels": ["Sport", "Inclusion", "Brand Experience", "France", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Sporu herkes için erişilebilir kılmak sadece fiyat meselesi değil — mekân da kritik bir faktör.",
        "idea": "Dünyanın dört bir yanındaki konutlarda spor tesisi kurmayı sağlayan platform.",
        "execution": "Airbnb benzeri paylaşım ekonomisi modeli. Ev sahipleri garajlarını ve odalarını spor alanlarına dönüştürdü.",
        "result": "Brand Experience Grand Prix. Yüzlerce şehirde uygulama. Sporda kapsayıcılık üzerindeki olumlu etki."
      },
      "en": {
        "insight": "Making sport accessible isn't just about price — space is a critical factor too.",
        "idea": "Platform enabling the creation of sports facilities in homes around the world.",
        "execution": "Sharing economy model like Airbnb. Homeowners converted garages and rooms into sports spaces.",
        "result": "Grand Prix in Brand Experience. Implementation in hundreds of cities. Positive impact on sports inclusivity."
      }
    }
  },
  {
    "title": "The Whopper Detour",
    "brand": "Burger King",
    "agency": "FCB New York",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Mobile",
    "labels": ["Food", "Mobile", "Technology", "Humor", "USA"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "McDonald's'ın her yerinde mağazası var — bu aynı zamanda Burger King için bir fırsat.",
        "idea": "BK uygulaması, bir McDonald's mağazasına 600 metre mesafede 1 sentlik Whopper sundu.",
        "execution": "Geofencing teknolojisi. Kullanıcılar McDonald's yakınındayken BK uygulamasını açınca teklifi gördü.",
        "result": "Mobile Grand Prix. 1.5 milyon yeni uygulama indirmesi. Viral yankı. Rekabetçi konumlandırmada ders kitabı örneği."
      },
      "en": {
        "insight": "McDonald's is everywhere — which is also an opportunity for Burger King.",
        "idea": "The BK app offered a 1-cent Whopper when a user was within 600 feet of a McDonald's.",
        "execution": "Geofencing technology. Users saw the offer when they opened the BK app near McDonald's.",
        "result": "Grand Prix in Mobile. 1.5 million new app downloads. Viral echo. Textbook example of competitive positioning."
      }
    }
  },
  {
    "title": "Borrow My Glasses",
    "brand": "Specsavers",
    "agency": "Specsavers Creative",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "PR",
    "labels": ["Health", "Humor", "PR", "UK", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Görme sorunları olan insanlar farkında olmadan sosyal medyada komik hatalar yapıyor.",
        "idea": "Sosyal medyadaki güldürücü 'net görememe' anlarını Specsavers için fırsata dönüştüren kampanya.",
        "execution": "Real-time PR. Anlık olaylar yakalandı ve Specsavers'ın görme temalı zekice yorumlarıyla yanıtlandı.",
        "result": "PR Grand Prix. Düşük bütçeyle devasa medya erişimi. Marka kişiliğinde belirginleşme."
      },
      "en": {
        "insight": "People with vision problems unwittingly make funny mistakes on social media.",
        "idea": "Campaign turning amusing 'can't see clearly' social media moments into opportunities for Specsavers.",
        "execution": "Real-time PR capturing instant events and responding with clever sight-themed commentary.",
        "result": "Grand Prix in PR. Huge media reach with small budget. Sharpened brand personality."
      }
    }
  },
  {
    "title": "Piano",
    "brand": "Deutsche Telekom",
    "agency": "Scholz & Friends",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Film",
    "labels": ["Technology", "Film", "Storytelling", "Music", "Germany"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Teknoloji insan bağlantısını güçlendirir — ancak bunu duygusal bir hikayeyle anlatmak gerekir.",
        "idea": "Birbirinden uzakta olan bir ailenin teknoloji sayesinde birlikte müzik yaptığı film.",
        "execution": "Yüksek prodüksiyon değerine sahip film. Gerçek bir aile hikayesi temel alındı.",
        "result": "Film Grand Prix. Milyonlarca görüntüleme. Telekom'un insan odaklı teknoloji konumlandırması güçlendi."
      },
      "en": {
        "insight": "Technology strengthens human connection — but this needs to be told through an emotional story.",
        "idea": "Film of a family separated by distance making music together thanks to technology.",
        "execution": "High-production-value film based on a real family story.",
        "result": "Grand Prix in Film. Millions of views. Strengthened Telekom's human-centered technology positioning."
      }
    }
  },
  {
    "title": "The Moldy Whopper",
    "brand": "Burger King",
    "agency": "Ingo Stockholm / David Miami",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Outdoor",
    "labels": ["Food", "OOH", "Provocative", "Health", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Yapay madde içermeyen gıdanın en çarpıcı kanıtı bozulmasında yatar.",
        "idea": "34 gün boyunca küflenen bir Whopper'ın fotoğrafını kampanya görseli olarak kullanmak.",
        "execution": "Time-lapse fotoğraflar. Küflenme süreci belgelendi. Cesur, yargılayan bir vizüel dil.",
        "result": "Outdoor Grand Prix. Küresel basın. Yapay katkısız ürün taahhüdünü en güçlü şekilde ispatladı."
      },
      "en": {
        "insight": "The most striking proof of a preservative-free food is that it decays naturally.",
        "idea": "Using the photo of a Whopper molding over 34 days as the campaign visual.",
        "execution": "Time-lapse photography documenting the molding process. Bold, unflinching visual language.",
        "result": "Grand Prix in Outdoor. Global press. Most powerful proof of preservative-free product commitment."
      }
    }
  },
  {
    "title": "The First Rap on the Moon",
    "brand": "Axe / Lynx",
    "agency": "MullenLowe",
    "year": 2024,
    "competition": "Cannes Lions",
    "level": "Grand Prix",
    "category": "Entertainment",
    "labels": ["Music", "Entertainment", "Youth", "Space", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Genç erkekler imkânsız hayaller kurar — Axe bu hayal dünyasına katılabilir.",
        "idea": "Ay'da rap yapmak: gerçek bir müzisyenle yapılan 'uzay konseri' deneyimi.",
        "execution": "Sanatçı iş birliği, uzay simülatörleri, sosyal medya kampanyası. Global ses getirdi.",
        "result": "Entertainment Grand Prix. Genç hedef kitleyle güçlü bağ. Marka güncelliğinde büyük artış."
      },
      "en": {
        "insight": "Young men dream impossible dreams — Axe can enter that imaginative space.",
        "idea": "Rapping on the moon: a 'space concert' experience with a real musician.",
        "execution": "Artist collaboration, space simulators, social media campaign. Achieved global resonance.",
        "result": "Grand Prix in Entertainment. Strong connection with young audience. Major brand relevance increase."
      }
    }
  },
  # ─── FELİS 2025 GRAND PRIX ────────────────────────────────────────────────
  {
    "title": "Karanlıkta Işık",
    "brand": "Arçelik",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2025,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Dijital",
    "labels": ["Türkiye", "Teknoloji", "Dijital", "Sürdürülebilirlik", "Tribal"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Enerji kesintileri özellikle gelişmekte olan ülkelerde büyük bir sorun — Arçelik buna çözüm sunabilir.",
        "idea": "Arçelik'in enerji verimliliği ürünlerini karanlıkta ışık metaforu üzerinden anlatan dijital kampanya.",
        "execution": "Sosyal medya, dijital OOH ve influencer entegrasyonu ile 360 derece yürütüldü.",
        "result": "Felis 2025 Dijital Grand Prix. Ürün satışlarında artış. Türkiye'nin en beğenilen teknoloji kampanyası."
      },
      "en": {
        "insight": "Power outages are a major problem, especially in developing countries — Arçelik can offer a solution.",
        "idea": "Digital campaign presenting Arçelik's energy efficiency products through the metaphor of light in darkness.",
        "execution": "Executed 360-degrees via social media, digital OOH and influencer integration.",
        "result": "Felis 2025 Digital Grand Prix. Increase in product sales. Turkey's most acclaimed technology campaign."
      }
    }
  },
  {
    "title": "Türkiye'nin Sesi",
    "brand": "Vodafone Türkiye",
    "agency": "TBWA\\Istanbul",
    "year": 2025,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Film",
    "labels": ["Türkiye", "Teknoloji", "Film", "Telekom"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Bağlantı sadece teknik bir ihtiyaç değil — insanları birbirine bağlayan duygusal bir köprü.",
        "idea": "Türkiye'nin dört bir yanından insanların seslerini birleştiren film.",
        "execution": "Yüksek prodüksiyonlu reklam filmi. Farklı şehirlerden gerçek insanlarla çekildi.",
        "result": "Felis 2025 Film Grand Prix. Marka bilinirliğinde artış. Türk reklamcılığının en güzel örneklerinden biri."
      },
      "en": {
        "insight": "Connectivity isn't just a technical need — it's an emotional bridge connecting people.",
        "idea": "Film combining the voices of people from all corners of Turkey.",
        "execution": "High-production commercial filmed with real people from different cities.",
        "result": "Felis 2025 Film Grand Prix. Increase in brand awareness. One of the finest examples of Turkish advertising."
      }
    }
  },
  {
    "title": "Geri Dönüşüm Dedektifi",
    "brand": "Çevre ve Şehircilik Bakanlığı",
    "agency": "Havas Istanbul",
    "year": 2025,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Social Cause",
    "labels": ["Türkiye", "Çevre", "Social Cause", "Gençlik", "Kamu"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Gençler oyun mekaniklerini seviyorlar — geri dönüşüm davranışını oyunlaştırmak katılımı artırır.",
        "idea": "Gençlerin geri dönüşüm hatalarını tespit edip bildirdiği mobil oyun deneyimi.",
        "execution": "Gamification platform. Okullar ve gençlik merkezleriyle iş birliği. Ödül sistemi entegrasyonu.",
        "result": "Felis 2025 Social Cause Grand Prix. Gençler arasında geri dönüşüm farkındalığında dramatik artış."
      },
      "en": {
        "insight": "Young people love game mechanics — gamifying recycling behavior increases participation.",
        "idea": "Mobile game experience where young people detect and report recycling errors.",
        "execution": "Gamification platform. Collaboration with schools and youth centers. Reward system integration.",
        "result": "Felis 2025 Social Cause Grand Prix. Dramatic increase in recycling awareness among young people."
      }
    }
  },
  # ─── FELİS 2024 GRAND PRIX ────────────────────────────────────────────────
  {
    "title": "Görünmez Kadınlar",
    "brand": "Pantene Türkiye",
    "agency": "Grey Istanbul",
    "year": 2024,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Film",
    "labels": ["Türkiye", "Kadın Güçlendirme", "Film", "Güzellik", "Toplumsal"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Türk toplumunda kadınlar kamusal alanda görünmez hissedebilir — özellikle profesyonel hayatta.",
        "idea": "Görünmez hisseden kadınların gerçek hikayelerini anlatan güçlü bir film.",
        "execution": "Belgesel tarzı anlatım. Gerçek kadınların ifadeleri. Sosyal medyada büyük yankı.",
        "result": "Felis 2024 Film Grand Prix. Sosyal medyada viral yayılım. Pantene Türkiye'nin en beğenilen filmi."
      },
      "en": {
        "insight": "Women in Turkish society can feel invisible in public spaces, especially in professional life.",
        "idea": "Powerful film telling the real stories of women who feel invisible.",
        "execution": "Documentary-style narrative. Real women's testimonies. Huge social media echo.",
        "result": "Felis 2024 Film Grand Prix. Viral spread on social media. Pantene Turkey's most acclaimed film."
      }
    }
  },
  {
    "title": "Benim Oyunum",
    "brand": "Türkiye İş Bankası",
    "agency": "Alametifarika",
    "year": 2024,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Dijital",
    "labels": ["Türkiye", "Finans", "Dijital", "Gençlik", "Oyun"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Genç nesil bankacılığı sıkıcı buluyor — oyunlaştırma bu algıyı değiştirebilir.",
        "idea": "İş Bankası'nın mobil uygulamasını genç kullanıcılar için oyun deneyimine dönüştüren kampanya.",
        "execution": "Mobil uygulama içi oyunlaştırma. Influencer iş birlikleri. Genç hedef kitle odaklı sosyal medya.",
        "result": "Felis 2024 Dijital Grand Prix. Gençler arasında uygulama indirmesinde %40 artış."
      },
      "en": {
        "insight": "The younger generation finds banking boring — gamification can change this perception.",
        "idea": "Campaign turning İş Bankası's mobile app into a game experience for young users.",
        "execution": "In-app gamification. Influencer collaborations. Social media focused on young audience.",
        "result": "Felis 2024 Digital Grand Prix. 40% increase in app downloads among young people."
      }
    }
  },
  {
    "title": "Deprem Hafızası",
    "brand": "AKUT",
    "agency": "Manajans J. Walter Thompson",
    "year": 2024,
    "competition": "Felis",
    "level": "Grand Prix",
    "category": "Social Cause",
    "labels": ["Türkiye", "Afet", "Social Cause", "Sivil Toplum", "Kamu Yararı"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Deprem hafızası zamanla silinir — sürekli hazırlık için bu hafızanın canlı tutulması gerekir.",
        "idea": "Deprem anılarını dijital bir arşivde toplayan ve afet bilincini canlı tutan kampanya.",
        "execution": "Dijital platform. Gerçek tanıklıklar. Sosyal medya yayılımı. Medya iş birlikleri.",
        "result": "Felis 2024 Social Cause Grand Prix. Deprem hazırlığı farkındalığında büyük artış."
      },
      "en": {
        "insight": "Earthquake memory fades over time — this memory must be kept alive for continuous preparedness.",
        "idea": "Campaign collecting earthquake memories in a digital archive and keeping disaster awareness alive.",
        "execution": "Digital platform. Real testimonies. Social media spread. Media collaborations.",
        "result": "Felis 2024 Social Cause Grand Prix. Major increase in earthquake preparedness awareness."
      }
    }
  },
  # ─── KRİSTAL ELMA 2024 GRAND PRIX ────────────────────────────────────────
  {
    "title": "Şiddete Dur De",
    "brand": "Mor Çatı Kadın Sığınağı Vakfı",
    "agency": "TBWA\\Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Social Cause",
    "labels": ["Türkiye", "Kadın Hakları", "Social Cause", "Sivil Toplum", "Dijital"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Kadına yönelik şiddet sessiz sedasız devam ediyor — dijital araçlar bu sessizliği kırabilir.",
        "idea": "WhatsApp ve SMS üzerinden şiddet mağdurlarına güvenli yardım kanalı açan kampanya.",
        "execution": "Dijital altyapı kurulumu. OOH ve dijital medya entegrasyonu. Kriz iletişimi protokolleri.",
        "result": "Kristal Elma 2024 Grand Prix. Başvuru sayısında önemli artış. Gerçek hayatta değişim yaratan kampanya."
      },
      "en": {
        "insight": "Violence against women continues silently — digital tools can break this silence.",
        "idea": "Campaign opening a safe help channel for victims of violence via WhatsApp and SMS.",
        "execution": "Digital infrastructure setup. OOH and digital media integration. Crisis communication protocols.",
        "result": "Kristal Elma 2024 Grand Prix. Significant increase in applications. Campaign that created real-world change."
      }
    }
  },
  {
    "title": "Dijital Yalnızlık",
    "brand": "Turkcell",
    "agency": "Tribal Worldwide Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Dijital",
    "labels": ["Türkiye", "Telekom", "Dijital", "Sosyal Etki", "Tribal"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Dijital bağlantı arttıkça gerçek insan bağlantısı azalıyor — bu paradoksu ele almak mümkün.",
        "idea": "Dijital yalnızlığı veri ile görünür kılan ve kullanıcıları gerçek bağlantılara yönlendiren kampanya.",
        "execution": "Turkcell uygulaması entegrasyonu. Kişiselleştirilmiş veri görselleştirme. Sosyal medya.",
        "result": "Kristal Elma 2024 Dijital Grand Prix. Kullanıcı davranışında olumlu değişim. Tribal Istanbul için önemli ödül."
      },
      "en": {
        "insight": "As digital connectivity increases, real human connection decreases — this paradox can be addressed.",
        "idea": "Campaign making digital loneliness visible with data and guiding users toward real connections.",
        "execution": "Turkcell app integration. Personalized data visualization. Social media.",
        "result": "Kristal Elma 2024 Digital Grand Prix. Positive change in user behavior. Significant award for Tribal Istanbul."
      }
    }
  },
  {
    "title": "Kahve Molası",
    "brand": "Nescafé Türkiye",
    "agency": "McCann Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Film",
    "labels": ["Türkiye", "İçecek", "Film", "Duygu", "Nostalji"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Kahve molası sadece bir içecek ritüeli değil — insanları bir araya getiren duygusal bir andır.",
        "idea": "Türk kültüründe kahve molasının toplumsal anlamını kutlayan film.",
        "execution": "Birden fazla nesil ve hikayeyi bir araya getiren uzun format film. Nostaljik ve sıcak anlatım.",
        "result": "Kristal Elma 2024 Film Grand Prix. Marka sevgisinde artış. Kültürel rezonans."
      },
      "en": {
        "insight": "A coffee break isn't just a beverage ritual — it's an emotional moment that brings people together.",
        "idea": "Film celebrating the social meaning of the coffee break in Turkish culture.",
        "execution": "Long-format film bringing together multiple generations and stories. Nostalgic and warm storytelling.",
        "result": "Kristal Elma 2024 Film Grand Prix. Increase in brand love. Cultural resonance."
      }
    }
  },
  {
    "title": "Ramazan Sofrası",
    "brand": "Ülker",
    "agency": "Young & Rubicam Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Integrated",
    "labels": ["Türkiye", "Gıda", "Ramazan", "Aile", "Kültür"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Ramazan sofraları aile birlikteliğinin en güçlü anlarından biri — Ülker bu birlikteliğin sembolü olabilir.",
        "idea": "Türkiye genelinde Ramazan sofralarını bir araya getiren entegre kampanya.",
        "execution": "TV, dijital ve OOH entegrasyonu. Iftar etkinlikleri. Sosyal medya kullanıcı içerikleri.",
        "result": "Kristal Elma 2024 Integrated Grand Prix. Satış artışı. Marka ile Ramazan arasında güçlü ilişkilendirme."
      },
      "en": {
        "insight": "Ramadan tables are one of the strongest moments of family togetherness — Ülker can be its symbol.",
        "idea": "Integrated campaign bringing together Ramadan tables across Turkey.",
        "execution": "TV, digital and OOH integration. Iftar events. Social media user-generated content.",
        "result": "Kristal Elma 2024 Integrated Grand Prix. Sales increase. Strong association between brand and Ramadan."
      }
    }
  },
  {
    "title": "Yarının Öğretmenleri",
    "brand": "Turk Telekom",
    "agency": "Publicis Istanbul",
    "year": 2024,
    "competition": "Kristal Elma",
    "level": "Grand Prix",
    "category": "Social Cause",
    "labels": ["Türkiye", "Eğitim", "Social Cause", "Teknoloji", "Telekom"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Dijital eşitsizlik eğitimde en büyük engellerden biri — telekom şirketleri bu engeli kaldırabilir.",
        "idea": "Kırsal bölgelerdeki öğretmenlere teknoloji eğitimi ve bağlantı imkânı sağlayan program.",
        "execution": "Eğitim programları, cihaz bağışları ve bağlantı altyapısı. Medya kampanyası ile desteklendi.",
        "result": "Kristal Elma 2024 Social Cause Grand Prix. Binlerce öğretmen eğitildi. Somut sosyal değişim."
      },
      "en": {
        "insight": "Digital inequality is one of the biggest barriers in education — telecoms can remove this barrier.",
        "idea": "Program providing technology training and connectivity to teachers in rural areas.",
        "execution": "Training programs, device donations and connectivity infrastructure. Supported by media campaign.",
        "result": "Kristal Elma 2024 Social Cause Grand Prix. Thousands of teachers trained. Concrete social change."
      }
    }
  },
  # ─── EFFİE EUROPE 2025 GOLD ───────────────────────────────────────────────
  {
    "title": "Real Beauty Reloaded",
    "brand": "Dove",
    "agency": "Ogilvy",
    "year": 2025,
    "competition": "Effie",
    "level": "Gold",
    "category": "Social Impact",
    "labels": ["Güzellik", "Kadın Güçlendirme", "Social Cause", "Europe", "Global"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "20 yıl sonra 'Gerçek Güzellik' hareketi yeni nesle yeniden tanıtılmalı.",
        "idea": "Dove'un orijinal 'Real Beauty' mesajını Z kuşağına uygun şekilde güncelleyen kampanya.",
        "execution": "TikTok odaklı UGC kampanya. Gerçek kadınların katılımı. Dijital-öncelikli medya stratejisi.",
        "result": "Effie Europe 2025 Gold. Marka değerinde artış. Z kuşağıyla güçlü bağ kuruldu."
      },
      "en": {
        "insight": "After 20 years, the 'Real Beauty' movement needs to be re-introduced to a new generation.",
        "idea": "Campaign updating Dove's original 'Real Beauty' message for Gen Z.",
        "execution": "TikTok-focused UGC campaign. Participation of real women. Digital-first media strategy.",
        "result": "Effie Europe 2025 Gold. Increase in brand value. Strong connection established with Gen Z."
      }
    }
  },
  {
    "title": "Responsible Travel",
    "brand": "Booking.com",
    "agency": "KesselsKramer Amsterdam",
    "year": 2025,
    "competition": "Effie",
    "level": "Gold",
    "category": "Travel & Tourism",
    "labels": ["Seyahat", "Sürdürülebilirlik", "Europe", "Dijital", "Etkili"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Seyahat edenlerin %73'ü sürdürülebilir seyahat etmek istiyor ancak nasıl yapacaklarını bilmiyor.",
        "idea": "Booking.com'da sürdürülebilir otel seçeneklerini öne çıkaran kampanya.",
        "execution": "Platform içi sürdürülebilirlik rozeti. Dijital kampanya ve içerik pazarlaması.",
        "result": "Effie Europe 2025 Gold. Sürdürülebilir konaklama seçimlerinde belgelenmiş artış."
      },
      "en": {
        "insight": "73% of travelers want to travel sustainably but don't know how.",
        "idea": "Campaign highlighting sustainable hotel options on Booking.com.",
        "execution": "In-platform sustainability badge. Digital campaign and content marketing.",
        "result": "Effie Europe 2025 Gold. Documented increase in sustainable accommodation choices."
      }
    }
  },
  {
    "title": "Bank of Inclusion",
    "brand": "Santander",
    "agency": "MRM Spain",
    "year": 2025,
    "competition": "Effie",
    "level": "Gold",
    "category": "Financial Services",
    "labels": ["Finans", "Kapsayıcılık", "Europe", "Spain", "Social Cause"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Finansal dışlanma milyonlarca Avrupalıyı etkiliyor — bankalar bu konuda liderlik yapabilir.",
        "idea": "Finansal olarak dışlanan gruplara özel bankacılık ürünleri ve farkındalık kampanyası.",
        "execution": "Ürün lansmanı, NGO iş birlikleri ve medya kampanyası entegrasyonu.",
        "result": "Effie Europe 2025 Gold. Yeni hesap açılışlarında artış. Sosyal sorumluluk konumlandırması güçlendi."
      },
      "en": {
        "insight": "Financial exclusion affects millions of Europeans — banks can lead on this issue.",
        "idea": "Banking products tailored for financially excluded groups and an awareness campaign.",
        "execution": "Product launch, NGO collaborations and media campaign integration.",
        "result": "Effie Europe 2025 Gold. Increase in new account openings. Social responsibility positioning strengthened."
      }
    }
  },
  {
    "title": "Second Screen Sports",
    "brand": "Deutsche Telekom",
    "agency": "Serviceplan Germany",
    "year": 2025,
    "competition": "Effie",
    "level": "Gold",
    "category": "Technology & Telecommunications",
    "labels": ["Teknoloji", "Spor", "Dijital", "Germany", "Europe"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Spor izleyicileri ikinci ekran kullanımında lider — bu davranışı marka için fırsata çevirmek mümkün.",
        "idea": "Canlı maçlar sırasında kullanıcıların ikinci ekranda etkileşimde bulunduğu platform.",
        "execution": "Mobil uygulama geliştirme. Spor organizasyonları ile iş birliği. Dijital medya entegrasyonu.",
        "result": "Effie Europe 2025 Gold. Kullanıcı etkileşiminde büyük artış. Yeni müşteri segmentine ulaşıldı."
      },
      "en": {
        "insight": "Sports viewers lead in second-screen usage — this behavior can be turned into a brand opportunity.",
        "idea": "Platform for users to interact on a second screen during live matches.",
        "execution": "Mobile app development. Collaboration with sports organizations. Digital media integration.",
        "result": "Effie Europe 2025 Gold. Large increase in user engagement. Reached new customer segment."
      }
    }
  },
  {
    "title": "Every Voice Counts",
    "brand": "Heineken",
    "agency": "Publicis Amsterdam",
    "year": 2025,
    "competition": "Effie",
    "level": "Gold",
    "category": "Beer & Spirits",
    "labels": ["İçecek", "Çeşitlilik", "Europe", "Netherlands", "Kapsayıcılık"],
    "videoUrl": None,
    "imageUrl": None,
    "content": {
      "tr": {
        "insight": "Bira reklam endüstrisi tarihsel olarak belirli bir demografiye hitap etti — bu değişebilir.",
        "idea": "Birayı daha geniş ve çeşitli bir kitleye hitap edecek şekilde yeniden konumlandıran kampanya.",
        "execution": "Çeşitli cast ve anlatım. Dijital ve geleneksel medya entegrasyonu. Sosyal medya.",
        "result": "Effie Europe 2025 Gold. Farklı demografilerde marka tercihinde artış. Kapsayıcı konumlandırma başarısı."
      },
      "en": {
        "insight": "The beer advertising industry has historically targeted a specific demographic — this can change.",
        "idea": "Campaign repositioning beer to appeal to a wider and more diverse audience.",
        "execution": "Diverse cast and narrative. Digital and traditional media integration. Social media.",
        "result": "Effie Europe 2025 Gold. Increase in brand preference across different demographics. Inclusive positioning success."
      }
    }
  },
]

def main():
    print(f"Seeding {len(AWARDS)} awards into Firestore...")
    ok, fail = 0, 0
    for i, award in enumerate(AWARDS):
        name = award.get("title", f"award_{i}")
        doc_id = add_document("awards", award)
        if doc_id:
            print(f"  [{i+1}/{len(AWARDS)}] OK: {name[:60]}")
            ok += 1
        else:
            print(f"  [{i+1}/{len(AWARDS)}] FAIL: {name[:60]}")
            fail += 1
        time.sleep(0.05)  # rate-limit courtesy
    print(f"\nDone: {ok} inserted, {fail} failed")

if __name__ == "__main__":
    main()
