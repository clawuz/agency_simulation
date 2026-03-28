#!/usr/bin/env python3
"""Update confirmed video URLs for existing awards"""
import json, urllib.request, urllib.error, time, os

PROJECT_ID = "agency-planing"
config_path = os.path.expanduser("~/.config/configstore/firebase-tools.json")
with open(config_path) as f:
    config = json.load(f)
TOKEN = config.get("tokens", {}).get("access_token", "")
BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

def search_docs(title_contains):
    """Search for document by title"""
    url = f"{BASE_URL}:runQuery"
    body = json.dumps({
        "structuredQuery": {
            "from": [{"collectionId": "awards"}],
            "where": {
                "fieldFilter": {
                    "field": {"fieldPath": "title"},
                    "op": "EQUAL",
                    "value": {"stringValue": title_contains}
                }
            }
        }
    }).encode()
    req = urllib.request.Request(url, data=body, method="POST",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            results = json.loads(resp.read())
            docs = [r.get("document") for r in results if r.get("document")]
            return docs
    except Exception as e:
        print(f"Search error: {e}")
        return []

def update_video(doc_name, video_url):
    """Update videoUrl field of a document"""
    url = f"https://firestore.googleapis.com/v1/{doc_name}?updateMask.fieldPaths=videoUrl"
    body = json.dumps({"fields": {"videoUrl": {"stringValue": video_url}}}).encode()
    req = urllib.request.Request(url, data=body, method="PATCH",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            return True
    except urllib.error.HTTPError as e:
        print(f"  Update error {e.code}: {e.read().decode()[:100]}")
        return False

# Confirmed video URLs from research
UPDATES = [
    {"title": "The Misheard Version", "videoUrl": "https://www.youtube.com/watch?v=3M_htJ6lZ04"},
    {"title": "Pedigree Adoptable", "videoUrl": "https://www.youtube.com/watch?v=ZgRQ5UCbMBg"},
    {"title": "The Everyday Tactician", "videoUrl": "https://www.youtube.com/watch?v=elq83mERXv0"},
    {"title": "The Whopper Detour", "videoUrl": "https://www.youtube.com/watch?v=0Lxsnfyg5Gc"},
    {"title": "The Moldy Whopper", "videoUrl": "https://www.youtube.com/watch?v=LzKX-_PiJ5Q"},
]

def main():
    for item in UPDATES:
        docs = search_docs(item["title"])
        if not docs:
            print(f"  NOT FOUND: {item['title']}")
            continue
        for doc in docs:
            name = doc.get("name", "")
            ok = update_video(name, item["videoUrl"])
            short_id = name.split("/")[-1]
            print(f"  {'OK' if ok else 'FAIL'}: {item['title']} ({short_id})")
        time.sleep(0.1)
    print("Done")

if __name__ == "__main__":
    main()
