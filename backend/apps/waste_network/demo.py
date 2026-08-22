import json

from .network import create_waste_network


def main():
    net = create_waste_network()
    resident = net["access"].get_user("user-resident")
    worker = net["access"].get_user("user-worker")

    first = net["file_report"](
        resident["id"],
        {"lat": 20.35422, "lng": 85.81912},
        "Overflowing food leftovers at KP-7 mess bin",
        filename="mess_full.jpg",
        asset_code="BIN-KP7-WET",
    )
    duplicate = net["file_report"](
        resident["id"],
        {"lat": 20.35423, "lng": 85.81913},
        "Same mess bin still overflowing mixed waste",
        filename="mess_full_2.jpg",
        asset_code="BIN-KP7-WET",
    )
    parking = net["file_report"](
        resident["id"],
        {"lat": 20.3568, "lng": 85.8215},
        "Dry cardboard pile next to parking bin",
        filename="cardboard.jpg",
        asset_code="BIN-PARK-DRY",
    )
    plan = net["plan_for_worker"](worker["id"], {"lat": 20.353, "lng": 85.818})
    first_stop = plan["stops"][0]
    done = net["complete_with_proof"](
        worker["id"],
        first_stop["id"],
        first_stop["location"],
        "demo-after",
        "after-1",
    )
    nearest = net["chatbot"].chat("demo", "Where is the nearest wet bin?", location={"lat": 20.354, "lng": 85.819})
    print(json.dumps({
        "reports": {
            "first": first["report"]["id"],
            "duplicateAction": duplicate["merged"]["action"],
            "duplicateCount": duplicate["merged"]["group"]["count"],
            "parking": parking["report"]["id"],
        },
        "classification": first["classified"]["top"],
        "priority": first["scored"],
        "route": [{"id": s["id"], "cluster": s["clusterId"], "m": s["distanceFromPreviousMeters"]} for s in plan["stops"]],
        "proofOk": done["verified"]["ok"],
        "kpis": net["heat"].kpis(),
        "chat": nearest["reply"],
    }, indent=2))


if __name__ == "__main__":
    main()
