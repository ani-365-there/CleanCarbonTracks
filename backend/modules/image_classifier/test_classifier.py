from image_classifier import WASTE_CAMPUS_TAXONOMY, create_image_classifier


def test_classifies_from_caption():
    result = create_image_classifier(WASTE_CAMPUS_TAXONOMY).classify(
        text="overflowing food leftovers near mess",
        filename="bin_full.jpg",
    )
    assert result["unknown"] is False
    assert result["top"]["id"] in {"mixed", "wet"}
    assert result["ranked"][0]["score"] > 0.18


def test_prefers_vision_hints():
    result = create_image_classifier(WASTE_CAMPUS_TAXONOMY).classify(
        text="photo from courtyard",
        vision_labels=[{"label": "syringe medical", "score": 0.92}],
    )
    assert result["top"]["id"] == "hazardous"


def test_unknown_below_threshold():
    result = create_image_classifier(WASTE_CAMPUS_TAXONOMY, min_score=0.4).classify(text="hello world")
    assert result["unknown"] is True
    assert result["top"] is None
