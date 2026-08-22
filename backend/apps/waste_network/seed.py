def seed_campus(access, assets):
    resident = access.register_user("ria@kiit.test", "Ria", "password123", ["resident"], user_id="user-resident")
    worker = access.register_user("arun@kiit.test", "Arun", "password123", ["worker"], user_id="user-worker")
    admin = access.register_user("admin@kiit.test", "Facilities", "password123", ["admin"], user_id="user-admin")
    assets.import_all(
        [
            {
                "code": "BIN-KP7-WET",
                "name": "KP-7 mess wet bin",
                "type": "wet-bin",
                "location": {"lat": 20.3542, "lng": 85.8191},
                "tags": ["hostel", "mess", "kp7"],
            },
            {
                "code": "BIN-KP7-DRY",
                "name": "KP-7 dry bin",
                "type": "dry-bin",
                "location": {"lat": 20.35435, "lng": 85.8193},
                "tags": ["hostel", "kp7"],
            },
            {
                "code": "BIN-PARK-DRY",
                "name": "Parking dry bin",
                "type": "dry-bin",
                "location": {"lat": 20.3568, "lng": 85.8215},
                "tags": ["parking"],
            },
            {
                "code": "BIN-CANTEEN-MIX",
                "name": "Canteen overflow point",
                "type": "mixed-bin",
                "location": {"lat": 20.3534, "lng": 85.8184},
                "tags": ["canteen", "mess"],
            },
        ]
    )
    return {"resident": resident, "worker": worker, "admin": admin}
