# pdf-editor/legal_checker.py
import re
from typing import Optional

_KEYWORDS = [
    r'ausweis', r'zeugnis', r'urkunde', r'zertifikat',
    r'bescheinigung', r'führerschein', r'fuhrerschein',
    r'vertrag', r'rechnung', r'urteil', r'vollmacht',
    r'passport', r'certificate', r'contract', r'invoice',
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
