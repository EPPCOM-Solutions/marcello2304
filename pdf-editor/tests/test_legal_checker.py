# pdf-editor/tests/test_legal_checker.py
import pytest
from legal_checker import check

def test_no_warning_for_plain_text():
    assert check("Hallo Welt", "Dies ist ein normaler Brief.") is None

def test_warning_for_ausweis_keyword_in_page():
    result = check("Max Mustermann", "Personalausweis Nummer 123456789")
    assert result is not None
    assert "§ 267 StGB" in result

def test_warning_for_zeugnis_keyword():
    result = check("Sehr gut", "Schulzeugnis der Realschule Bayern")
    assert result is not None

def test_warning_for_urkunde_keyword():
    result = check("2025", "Geburtsurkunde Standesamt München")
    assert result is not None

def test_warning_for_vertrag_keyword():
    result = check("1000", "Mietvertrag Wohnung Berlin")
    assert result is not None

def test_warning_for_rechnung_keyword():
    result = check("500,00", "Rechnung Nr. 2025-001")
    assert result is not None

def test_warning_for_vollmacht_keyword():
    result = check("bevollmächtigt", "Vollmacht Handelsregister")
    assert result is not None

def test_no_warning_for_unrelated_amount():
    assert check("150,00 €", "Einkaufsliste Supermarkt") is None

def test_warning_is_string():
    result = check("test", "Führerschein Klasse B")
    assert isinstance(result, str)
    assert len(result) > 20

def test_case_insensitive():
    result = check("test", "AUSWEIS NR. 12345")
    assert result is not None
