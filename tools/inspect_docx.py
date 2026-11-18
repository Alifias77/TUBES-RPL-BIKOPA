import zipfile
import xml.etree.ElementTree as ET

docx_path = r'D:\BIKOPA\LAPORAN_TUGAS_PROYEK_RPL_BIKOPA (1).docx'

with zipfile.ZipFile(docx_path) as docx:
    files = docx.namelist()
    media_files = [f for f in files if f.startswith('word/media/')]
    print(f'Total embedded images/diagrams in docx: {len(media_files)}')
    for m in media_files[:15]:
        print('  ', m)

    tree = ET.fromstring(docx.read('word/document.xml'))
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text = ''.join([node.text for node in tree.iterfind('.//w:t', namespaces) if node.text])

    print(f'\nTotal document character count: {len(text)}')
    print(f'Total word count approximately: {len(text.split())}')

    placeholders = ['todo', 'fixme', '[...]', 'xxx', 'tbd', 'http://', 'https://', 'youtube']
    print('\nCheck for potential placeholders/links:')
    for ph in placeholders:
        count = text.lower().count(ph)
        print(f'  "{ph}": {count} occurrences')

    # Search for occurrences of youtube
    if 'youtube' in text.lower():
        print('\nYouTube mentions:')
        for line in text.split('.'):
            if 'youtube' in line.lower():
                print('  ->', line.strip())

    # Check student info
    for name in ['Fachri', 'Alifias', 'Akhsan', 'Nugraha', 'Tadulako']:
        print(f'Found "{name}": {name.lower() in text.lower()}')
