from intake import Bm25Index, create_action_chatbot

CORPUS = [
    {
        "id": "sop-wet",
        "title": "Wet waste rules",
        "body": "Food leftovers, peels and spoiled items go in wet bins. Pizza boxes with grease are wet, not dry.",
        "tags": ["wet", "segregation"],
    },
    {
        "id": "hours",
        "title": "Collection hours",
        "body": "Hostel wet waste is collected at 7am and 2pm. Dry waste is collected on Monday and Thursday.",
        "tags": ["schedule"],
    },
]


def test_retrieves_sop_without_llm():
    res = create_action_chatbot(CORPUS).chat("s1", "Where do greasy pizza boxes go?")
    assert res["intent"] == "faq"
    assert res["citations"][0]["id"] == "sop-wet"
    assert "wet" in res["reply"].lower()


def test_files_report_via_tools():
    bot = create_action_chatbot(CORPUS, tools={"create_report": lambda draft: {"id": "r-123"}})
    res = bot.chat("s1", "Report overflowing mixed waste near the mess", location={"lat": 20.35, "lng": 85.82})
    assert res["intent"] == "report"
    assert res["action"]["type"] == "create_report"
    assert "r-123" in res["reply"]


def test_finds_nearest():
    bot = create_action_chatbot(
        CORPUS,
        tools={"find_nearest": lambda inp: [{"id": "bin-1", "name": "KP-7 wet bin", "type": "wet-bin", "distanceMeters": 42}]},
    )
    res = bot.chat("s1", "Where is the nearest wet bin?", location={"lat": 20.35, "lng": 85.82})
    assert res["intent"] == "nearest"
    assert "KP-7" in res["reply"]


def test_bm25_ranking():
    index = Bm25Index(CORPUS)
    assert index.search("pizza box grease")[0]["id"] == "sop-wet"
    assert index.search("2pm hostel collection")[0]["id"] == "hours"
