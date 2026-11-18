import zipfile
import xml.etree.ElementTree as ET

docx_path = r'D:\BIKOPA\LAPORAN_TUGAS_PROYEK_RPL_BIKOPA (1).docx'

with zipfile.ZipFile(docx_path) as docx:
    tree = ET.fromstring(docx.read('word/document.xml'))
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in tree.iterfind('.//w:p', namespaces):
        t = ''.join([node.text for node in p.iterfind('.//w:t', namespaces) if node.text])
        if t.strip():
            paragraphs.append(t.strip())

print("--- OCCURRENCES OF 'TODO' ---")
for p in paragraphs:
    if 'todo' in p.lower():
        print("P:", p[:150])

print("\n--- OCCURRENCES OF 'XXX' ---")
for p in paragraphs:
    if 'xxx' in p.lower():
        print("P:", p[:150])
