import os
import json

def get_assets_info(assets_dir):
    assets_data = []
    for asset_dir in os.listdir(assets_dir):
        asset_path = os.path.join(assets_dir, asset_dir)
        if os.path.isdir(asset_path):
            metadata_file = os.path.join(asset_path, "metadata.json")
            if os.path.exists(metadata_file):
                with open(metadata_file, "r") as f:
                    metadata = json.load(f)
                styles = ["Default", "Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"]
                sources = {}
                asset_info = {"name": asset_dir, "metadata": metadata, "sources": sources}
                for style in styles:
                    style_dir = os.path.join(asset_path, style)
                    if os.path.exists(style_dir) and os.path.isdir(style_dir):
                        if "styles" not in asset_info:
                            asset_info["styles"] = styles
                        sources[style] = {}
                        for source in ["3D", "Color", "Flat"]:
                            source_dir = os.path.join(style_dir, source)
                            if os.path.exists(source_dir) and os.path.isdir(source_dir):
                                for file in os.listdir(source_dir):
                                    if file.endswith(".svg") or file.endswith(".png"):
                                        sources[style][source] = os.path.join(source_dir, file)
                                        break
                    else:
                        for source in ["3D", "Color", "Flat", "High Contrast"]:
                            source_dir = os.path.join(asset_path, source)
                            if os.path.exists(source_dir) and os.path.isdir(source_dir):
                                for file in os.listdir(source_dir):
                                    if file.endswith(".svg") or file.endswith(".png"):
                                        sources[source] = os.path.join(source_dir, file)
                                        break
                assets_data.append(asset_info)
    return {"data": assets_data}

assets_info = get_assets_info("assets")
with open("assets_info.json", "w") as f:
    json.dump(assets_info, f, indent=4)
