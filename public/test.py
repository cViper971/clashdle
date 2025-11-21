import requests, os, json

API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijc2OTVhNjNhLTY1MGMtNDdmYy04NThlLWU3ZmIxMzBiMWFlMCIsImlhdCI6MTc2MzY5MjIwNCwic3ViIjoiZGV2ZWxvcGVyLzZiMmRiYWMzLTg4MGYtOTdhZS1kZDcwLTRlNWU0ZmE0M2M0ZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTIuMy40My40MiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.uISKxpkXufV2piqDnO3DFkA7CGe9_Tjv8kwYdBFnUR8cabTYeCF4O4J3ykJiF7BuV8-Zl_1Xz9_Paroh_MzsCg"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

r = requests.get("https://api.clashroyale.com/v1/cards", headers=headers)
cards = r.json()["items"]

os.makedirs("images", exist_ok=True)

data = []
for c in cards:
    name = c["name"]
    url = c["iconUrls"]["medium"]
    filename = f"images/{name.replace(' ', '_')}.png"

    img = requests.get(url)
    with open(filename, "wb") as f:
        f.write(img.content)

    data.append({"name": name, "image": filename})
    print(f"Saved {name}")

with open("cards.json", "w") as f:
    json.dump(data, f, indent=2)
