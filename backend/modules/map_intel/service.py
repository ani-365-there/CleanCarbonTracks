from __future__ import annotations

from .heatmap import HeatmapKpi, create_heatmap_kpi
from .registry import GeoAssetRegistry, create_geo_asset_registry


class MapIntel:
    """Geo-asset catalog + area heatmap / KPIs."""

    def __init__(self, now=None, cell_size_meters: float = 80):
        self.assets = create_geo_asset_registry(now=now)
        self.heat = create_heatmap_kpi(cell_size_meters=cell_size_meters)

    def nearest(self, origin: dict, **kwargs):
        return self.assets.nearest(origin, **kwargs)

    def ingest_ticket(self, event: dict) -> None:
        self.heat.ingest(event)


def create_map_intel(**kwargs) -> MapIntel:
    return MapIntel(**kwargs)
