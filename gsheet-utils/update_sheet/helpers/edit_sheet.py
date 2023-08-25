"""Utils for editing existing GSheets"""

dummy_data = [
    [100, "Article One", "Lorem ipsum...", "https://example.com"],
    [101, "Article Two", "Lorem ipsum...", "https://example.com"],
    [102, "Article Three", "Lorem ipsum...", "https://example.com"],
]


def insert_rows(sheet_ref, row_data=dummy_data):
    for row in row_data:
        sheet_ref.append_row(row)
