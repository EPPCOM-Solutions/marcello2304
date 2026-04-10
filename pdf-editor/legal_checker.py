# pdf-editor/legal_checker.py
import re
from typing import Optional

_KEYWORDS = [
    r'ausweis\b', r'zeugnis\b', r'urkunde\b', r'zertifikat\b',
    r'bescheinigung\b', r'führerschein\b', r'fuhrerschein\b',
    r'vertrag\b', r'rechnung\b', r'urteil\b', r'vollmacht\b',
    r'passport\b', r'certificate\b', r'contract\b', r'invoice\b',
]

_WARNING = (
    "Hinweis: Diese Änderung betrifft möglicherweise ein amtliches oder "
    "rechtlich relevantes Dokument. Unbefugte Urkundenfälschung ist strafbar "
    "(§ 267 StGB). Bitte sicherstellen, dass du zur Bearbeitung berechtigt bist."
)


def check(new_text: str, page_text: str) -> Optional[str]:
    """
    Return warning string if edit seems legally sensitive, else None.
    Checks the combined text (new_text + page_text) for sensitive keywords.
    """
    combined = new_text + " " + page_text
    for pattern in _KEYWORDS:
        if re.search(pattern, combined, re.IGNORECASE):
            return _WARNING
    return None
