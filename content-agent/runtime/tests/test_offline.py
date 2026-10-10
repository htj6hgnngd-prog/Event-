import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import photo_selector as selector


class OfflineTests(unittest.TestCase):
    def test_json_parser(self):
        self.assertEqual(selector.parse_json_text('{"ok": true}')["ok"], True)
        self.assertEqual(selector.parse_json_text('{"count": 3}')["count"], 3)

    def test_shortlist_uses_only_known_filenames(self):
        ratings = [
            {"filename":"a.jpg","scores":{"composition":4,"light":3},"strongest_role":"cover","candidate":True},
            {"filename":"b.jpg","scores":{"composition":3,"light":3},"strongest_role":"wide","candidate":True},
            {"filename":"invented.jpg","scores":{"composition":4},"strongest_role":"detail","candidate":True},
        ]
        result = selector.shortlist_payload(ratings, {"a.jpg":Path("a.jpg"),"b.jpg":Path("b.jpg")}, 2)
        self.assertEqual({x["filename"] for x in result}, {"a.jpg","b.jpg"})

    def test_local_inventory_has_exact_filenames(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp) / "input"
            root.mkdir()
            (root / "IMG_1001.jpg").write_bytes(b"placeholder")
            (root / "DSC_2002.JPG").write_bytes(b"placeholder")
            args = type("Args", (), {"input_dir":str(root), "yandex_url":None, "yandex_path":"/JPEG"})()
            work = Path(temp) / "out"
            files, file_map, inventory, original_paths = selector.collect_source(args, work)
            self.assertEqual([p.name for p in files], ["DSC_2002.JPG","IMG_1001.jpg"])
            self.assertEqual(set(file_map), {"DSC_2002.JPG","IMG_1001.jpg"})
            self.assertEqual(inventory["count"], 2)
            self.assertEqual(original_paths, {})

    def test_contact_sheet(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            files = []
            for name, color in [("a.jpg",(20,40,60)),("b.jpg",(60,40,20))]:
                p = root / name
                Image.new("RGB",(60,90),color).save(p)
                files.append(p)
            out = root / "sheet.jpg"
            selector.render_contact_sheet(files,out)
            self.assertTrue(out.exists())
            with Image.open(out) as im:
                self.assertGreater(im.width, 0)
                self.assertGreater(im.height, 0)


if __name__ == "__main__":
    unittest.main()
