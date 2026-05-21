# API Contract

## POST /search

### Request

- **URL:** `/search`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`

```json
{
  "image_base64": "<base64‑encoded image string>",
  "top_k": <number of results requested>
}
```

### Response 

- **Status:** `200 OK` (or appropriate error code)
- **Body:** an array of result objects

```json 
[
  {
    "rank": <integer>,
    "image_url": "<string>",
    "name": "<string>",
    "class": "<string>",
    "score": <float>
  },
  {
    "rank": 2,
    "image_url": "https://...",
    "name": "bag_002",
    "class": "accessory",
    "score": 0.823
  }
  // ... up to top_k entries
]
```

Fields description:
- `rank` &ndash; position in the sorted results (1-based)
- `image_url` &ndash; link to the returned image
- `name` &ndash; human‑readable identifier
- `class` &ndash; predicted category/class label
- `score` &ndash; confidence/probability score (0.0–1.0)
