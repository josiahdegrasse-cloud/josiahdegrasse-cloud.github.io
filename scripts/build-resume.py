import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter

root=Path(__file__).resolve().parent.parent
data=json.loads((root/'src/resume-content.json').read_text())
out=root/'public/josiah-degrasse-design-resume.pdf'
ink=colors.HexColor('#272320'); muted=colors.HexColor('#68605b'); green=colors.HexColor('#773f43'); line=colors.HexColor('#d9d3cc')
styles={
'name':ParagraphStyle('name',fontName='Times-Roman',fontSize=29,leading=31,textColor=ink),
'title':ParagraphStyle('title',fontName='Helvetica',fontSize=11,leading=15,textColor=green),
'body':ParagraphStyle('body',fontName='Helvetica',fontSize=9.2,leading=12.5,textColor=muted),
'section':ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=8,leading=12,spaceBefore=11,spaceAfter=5,textColor=green),
'role':ParagraphStyle('role',fontName='Helvetica-Bold',fontSize=9.4,leading=13,textColor=ink),
'date':ParagraphStyle('date',fontName='Helvetica',fontSize=8.2,leading=12,textColor=muted,alignment=2),
'small':ParagraphStyle('small',fontName='Helvetica',fontSize=7.3,leading=10,textColor=muted),
'bullet':ParagraphStyle('bullet',fontName='Helvetica',fontSize=9.1,leading=12.2,textColor=muted,leftIndent=8,firstLineIndent=-7,spaceAfter=3),
}
def p(text,style='body'):return Paragraph(escape(text),styles[style])
def section(name):return [p(name.upper(),'section'),HRFlowable(width='100%',thickness=.5,color=line),Spacer(1,6)]
story=[p(data['name'],'name'),Spacer(1,4),p(data['title'],'title'),Spacer(1,7),Paragraph('Josiah.deGrasse@tufts.edu &nbsp; | &nbsp; <link href="https://www.linkedin.com/in/josiahdegrasse">linkedin.com/in/josiahdegrasse</link>',styles['small']),Spacer(1,9),p(data['summary'])]
story+=section('Experience')
for e in data['experience']:
 row=Table([[p(e['organization'],'role'),p(e['dates'],'date')]],colWidths=[365,163]);row.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),1)]))
 story.extend([row,p(e['role'],'body')])
 if e.get('context'):story.append(p(e['context'],'small'))
 story.append(Spacer(1,4))
 for b in e['bullets']:story.append(p('• '+b,'bullet'))
 story.append(Spacer(1,5))
story+=section('Education')
story += [p(data['education']['school'],'role'),p(data['education']['degree']+' | '+data['education']['date'])]
story+=section('Practice')
for s in data['skills']:story.extend([Paragraph('<b>'+escape(s['label'])+':</b> '+escape(s['text']),styles['body']),Spacer(1,4)])
story+=section('Leadership & community')
story.append(p(data['community']))
story.append(Spacer(1,7));story.append(p('Outside work: '+data['interests'],'small'))
doc=SimpleDocTemplate(str(out),pagesize=letter,rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=32,title=data['name']+' - '+data['title'],author=data['name'])
doc.build(story)
from pypdf import PdfReader
pages=len(PdfReader(out).pages)
print(str(out), 'pages:', pages)
assert pages==1, 'Resume must fit one page'
# Render with the bundled PDFium runtime for visual verification.
import pypdfium2 as pdfium
pdf=pdfium.PdfDocument(str(out));pdf[0].render(scale=1.6).to_pil().save('/tmp/portfolio-qa/resume.png')
