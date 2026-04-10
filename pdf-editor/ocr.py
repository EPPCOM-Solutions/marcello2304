# pdf-editor/ocr.py
import json
import math
import os
import tempfile
from pathlib import Path

_ocr_instance = None


def _get_ocr():
    global _ocr_instance
    if _ocr_instance is None:
        from paddleocr import PaddleOCR as _PaddleOCR
        _ocr_instance = _PaddleOCR(
            use_angle_cls=True,
            lang="en",       # works for Latin script incl. German
            use_gpu=False,
            show_log=False,
        )
    return _ocr_instance


def _compute_angle(bbox: list) -> float:
    """Compute text rotation angle in degrees from 4-point bbox."""
    dx = bbox[1][0] - bbox[0][0]
    dy = bbox[1][1] - bbox[0][1]
    return math.degrees(math.atan2(dy, dx))


def run_ocr(image_path: str, cache_path: str) -> list:
    """
    Run PaddleOCR on image_path, cache result at cache_path.
    Returns list of dicts: {text, bbox, angle, confidence}
    """
    cache = Path(cache_path)
    if cache.exists():
        try:
            return json.loads(cache.read_text())
        except (json.JSONDecodeError, OSError):
            pass  # fall through to re-run OCR

    ocr = _get_ocr()
    result = ocr.ocr(image_path, cls=True)

    blocks = []
    if result and result[0]:
        for line in result[0]:
            bbox, (text, confidence) = line
            blocks.append({
                "text": text,
                "bbox": bbox,
                "angle": _compute_angle(bbox),
                "confidence": float(confidence),
            })

    if blocks:
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".json", dir=str(cache.parent))
        try:
            os.close(tmp_fd)
            Path(tmp_path).write_text(json.dumps(blocks))
            os.replace(tmp_path, str(cache))
        except Exception:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
            raise
    return blocks
