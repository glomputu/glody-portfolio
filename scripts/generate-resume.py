from __future__ import annotations

import argparse
import json
import shutil
from html import escape
from io import BytesIO
from pathlib import Path

from PIL import Image as PillowImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "src" / "data" / "resumeContent.json"
PORTRAIT_PATH = ROOT / "public" / "images" / "profile" / "glodi-mputu.jpeg"

NAVY = colors.HexColor("#0B1320")
GREEN = colors.HexColor("#0A7F58")
GREEN_SOFT = colors.HexColor("#E7F3EE")
INK = colors.HexColor("#17231D")
MUTED = colors.HexColor("#53635A")
LINE = colors.HexColor("#D8E1DB")
PAPER = colors.HexColor("#FBFAF6")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Segoe", r"C:\Windows\Fonts\segoeui.ttf"))
    pdfmetrics.registerFont(TTFont("Segoe-Semibold", r"C:\Windows\Fonts\seguisb.ttf"))
    pdfmetrics.registerFont(TTFont("Segoe-Bold", r"C:\Windows\Fonts\segoeuib.ttf"))
    pdfmetrics.registerFontFamily(
        "Segoe",
        normal="Segoe",
        bold="Segoe-Bold",
        italic="Segoe",
        boldItalic="Segoe-Bold",
    )


def portrait_stream() -> BytesIO:
    with PillowImage.open(PORTRAIT_PATH) as source:
        image = source.convert("RGB")
        width, height = image.size
        crop_width = min(width, int(height * 0.78))
        crop_height = int(crop_width * 1.16)
        left = max(0, (width - crop_width) // 2)
        top = max(0, min(int(height * 0.035), height - crop_height))
        image = image.crop((left, top, left + crop_width, top + crop_height))
        image.thumbnail((560, 650), PillowImage.Resampling.LANCZOS)
        stream = BytesIO()
        image.save(stream, format="JPEG", quality=90, optimize=True)
        stream.seek(0)
        return stream


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Heading1"],
            fontName="Segoe-Bold",
            fontSize=25,
            leading=28,
            textColor=NAVY,
            spaceAfter=3,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Normal"],
            fontName="Segoe-Semibold",
            fontSize=10.2,
            leading=14,
            textColor=GREEN,
            spaceAfter=6,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Segoe",
            fontSize=8.4,
            leading=12,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName="Segoe-Bold",
            fontSize=10.5,
            leading=14,
            textColor=NAVY,
            spaceBefore=10,
            spaceAfter=6,
            borderColor=GREEN,
            borderWidth=0,
            borderPadding=0,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Segoe",
            fontSize=8.8,
            leading=13.2,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=base["Heading3"],
            fontName="Segoe-Bold",
            fontSize=9.7,
            leading=12,
            textColor=NAVY,
            spaceAfter=1,
        ),
        "organization": ParagraphStyle(
            "Organization",
            parent=base["Normal"],
            fontName="Segoe-Semibold",
            fontSize=8.4,
            leading=11,
            textColor=GREEN,
        ),
        "period": ParagraphStyle(
            "Period",
            parent=base["Normal"],
            fontName="Segoe-Semibold",
            fontSize=8.1,
            leading=11,
            textColor=MUTED,
            alignment=2,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="Segoe",
            fontSize=8.25,
            leading=11.4,
            leftIndent=10,
            firstLineIndent=-6,
            textColor=INK,
            spaceBefore=1.5,
        ),
        "skill": ParagraphStyle(
            "Skill",
            parent=base["Normal"],
            fontName="Segoe-Semibold",
            fontSize=7.8,
            leading=10.2,
            textColor=INK,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["Normal"],
            fontName="Segoe",
            fontSize=8,
            leading=11.5,
            textColor=MUTED,
        ),
    }


def section_heading(label: str, style: ParagraphStyle, accent_width=52 * mm):
    return Table(
        [[Paragraph(escape(label.upper()), style), ""]],
        colWidths=[accent_width, None],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LINEBELOW", (0, 0), (-1, -1), 0.7, LINE),
                ("LINEBELOW", (0, 0), (0, 0), 2.2, GREEN),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        ),
    )


def experience_block(item: dict, style: dict, available_width=108 * mm):
    heading = Table(
        [
            [Paragraph(escape(item["role"]), style["role"]), Paragraph(escape(item["period"]), style["period"])],
            [Paragraph(escape(item["organization"]), style["organization"]), ""],
        ],
        colWidths=[available_width - 31 * mm, 31 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("SPAN", (0, 1), (1, 1)),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    bullets = [Paragraph(f"• {escape(text)}", style["bullet"]) for text in item["responsibilities"]]
    return [heading, Spacer(1, 1.5 * mm), *bullets, Spacer(1, 2.6 * mm)]


def page_footer(canvas, doc, language: str, name: str):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
    canvas.setFillColor(GREEN)
    canvas.rect(0, A4[1] - 4 * mm, A4[0], 4 * mm, stroke=0, fill=1)
    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, 14 * mm, A4[0] - 20 * mm, 14 * mm)
    canvas.setFont("Segoe", 7.2)
    canvas.setFillColor(MUTED)
    page_label = "Page" if language == "fr" else "Page"
    canvas.drawString(20 * mm, 9 * mm, name)
    canvas.drawRightString(A4[0] - 20 * mm, 9 * mm, f"{page_label} {doc.page}")
    canvas.setTitle(f"{name} - CV {language.upper()}")
    canvas.setAuthor(name)
    canvas.setSubject("Software Engineer | Back-End Developer | IT Manager")
    canvas.restoreState()


def build_pdf(language: str, content: dict, destination: Path) -> None:
    style = styles()
    doc = SimpleDocTemplate(
        str(destination),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=15 * mm,
        bottomMargin=20 * mm,
        pageCompression=1,
        title=f"{content['name']} - CV {language.upper()}",
        author=content["name"],
    )

    portrait = Image(portrait_stream(), width=33 * mm, height=39 * mm)
    identity = [
        Paragraph(escape(content["name"]), style["name"]),
        Paragraph(escape(content["title"]), style["title"]),
        Paragraph(
            escape(
                f"{content['contact']['location']}  |  {content['contact']['email']}<br/>"
                + "  |  ".join(content["contact"]["phones"])
            ).replace("&lt;br/&gt;", "<br/>") ,
            style["contact"],
        ),
    ]
    header = Table(
        [[portrait, identity]],
        colWidths=[39 * mm, 130 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )

    labels = content["sectionLabels"]
    left_column = [section_heading(labels["skills"], style["section"], 31 * mm), Spacer(1, 2.5 * mm)]
    skill_rows = [[Paragraph(f"• {escape(skill)}", style["skill"])] for skill in content["skills"]]
    skill_table = Table(skill_rows, colWidths=[54 * mm])
    skill_table.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.8),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    left_column.extend([skill_table, Spacer(1, 4 * mm), section_heading(labels["education"], style["section"], 31 * mm), Spacer(1, 2 * mm)])

    education_rows = []
    for item in content["education"]:
        education_rows.append(
            [
                Paragraph(f"<b>{escape(item['degree'])}</b><br/><font color='#0A7F58'>{escape(item['institution'])}</font>", style["body"]),
                Paragraph(escape(item["period"]), style["period"]),
            ]
        )
    education_table = Table(education_rows, colWidths=[38 * mm, 16 * mm])
    education_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE),
            ]
        )
    )
    left_column.extend([education_table, Spacer(1, 4 * mm)])
    strengths = " | ".join(content["strengths"])
    languages = " | ".join(content["languages"])
    bottom = Table(
        [
            [Paragraph(f"<b>{escape(labels['strengths'])}</b><br/>{escape(strengths)}", style["small"])],
            [Paragraph(f"<b>{escape(labels['languages'])}</b><br/>{escape(languages)}", style["small"])],
        ],
        colWidths=[54 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0F3F0")),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        ),
    )
    left_column.append(bottom)

    right_column = [
        section_heading(labels["profile"], style["section"], 39 * mm),
        Spacer(1, 2.5 * mm),
        Paragraph(escape(content["summary"]), style["body"]),
        Spacer(1, 3 * mm),
        section_heading(labels["experience"], style["section"], 43 * mm),
        Spacer(1, 2.5 * mm),
    ]
    for item in content["experiences"]:
        right_column.extend(experience_block(item, style, 108 * mm))

    content_table = Table(
        [[left_column, right_column]],
        colWidths=[58 * mm, 111 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#F0F5F1")),
                ("BOX", (0, 0), (0, 0), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (0, 0), 8),
                ("RIGHTPADDING", (0, 0), (0, 0), 8),
                ("TOPPADDING", (0, 0), (0, 0), 9),
                ("BOTTOMPADDING", (0, 0), (0, 0), 9),
                ("LEFTPADDING", (1, 0), (1, 0), 12),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (1, 0), (1, 0), 0),
                ("BOTTOMPADDING", (1, 0), (1, 0), 0),
            ]
        ),
    )

    story = [header, Spacer(1, 6 * mm), content_table]

    doc.build(story, onFirstPage=lambda c, d: page_footer(c, d, language, content["name"]), onLaterPages=lambda c, d: page_footer(c, d, language, content["name"]))


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate the bilingual production resumes.")
    parser.add_argument("--output-dir", default=str(ROOT / "output" / "pdf"))
    parser.add_argument("--public-dir", default=str(ROOT / "public" / "documents"))
    args = parser.parse_args()

    register_fonts()
    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    output_dir = Path(args.output_dir)
    public_dir = Path(args.public_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)

    names = {"fr": "GloDi-MPUTU-CV-FR.pdf", "en": "GloDi-MPUTU-Resume-EN.pdf"}
    for language, filename in names.items():
        destination = output_dir / filename
        build_pdf(language, content[language], destination)
        shutil.copy2(destination, public_dir / filename)
        print(f"Generated {destination}")


if __name__ == "__main__":
    main()
