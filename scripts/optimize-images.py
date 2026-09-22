from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PROFILE_DIR = ROOT / "public" / "images" / "profile"
SOURCE = PROFILE_DIR / "glodi-mputu.jpeg"
FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMIBOLD = Path(r"C:\Windows\Fonts\seguisb.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def crop_portrait(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    width, height = image.size
    target_ratio = 4 / 5
    crop_width = min(width, int(height * target_ratio))
    crop_height = int(crop_width / target_ratio)
    left = max(0, (width - crop_width) // 2)
    top = max(0, min(int(height * 0.025), height - crop_height))
    return image.crop((left, top, left + crop_width, top + crop_height)).resize(
        (720, 900), Image.Resampling.LANCZOS
    )


def generate_social_image(portrait: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (1200, 630), "#050b14")
    draw = ImageDraw.Draw(canvas)

    for x in range(0, 1201, 80):
        draw.line((x, 0, x, 630), fill="#0b1726", width=1)
    for y in range(0, 631, 80):
        draw.line((0, y, 1200, y), fill="#0b1726", width=1)

    draw.ellipse((570, -190, 1220, 460), fill="#071f1d")
    draw.rounded_rectangle((68, 64, 132, 128), radius=17, fill="#0b2b26", outline="#176f58", width=2)
    mark_font = ImageFont.truetype(str(FONT_BOLD), 22)
    draw.text((100, 96), "GM", font=mark_font, fill="#34d399", anchor="mm")

    name_font = ImageFont.truetype(str(FONT_BOLD), 66)
    title_font = ImageFont.truetype(str(FONT_SEMIBOLD), 28)
    body_font = ImageFont.truetype(str(FONT_REGULAR), 25)
    label_font = ImageFont.truetype(str(FONT_SEMIBOLD), 19)

    draw.text((68, 188), "GloDi MPUTU", font=name_font, fill="#f8fafc")
    draw.text((70, 278), "Software Engineer · Back-End Developer", font=title_font, fill="#34d399")
    draw.text((70, 319), "IT Manager", font=title_font, fill="#34d399")
    draw.multiline_text(
        (70, 390),
        "Applications web et de gestion fiables,\nback-end, données et systèmes IT.",
        font=body_font,
        fill="#cbd5e1",
        spacing=11,
    )
    draw.line((70, 526, 565, 526), fill="#334155", width=2)
    draw.text((70, 550), "PHP  ·  JavaScript  ·  API REST  ·  Bases de données", font=label_font, fill="#94a3b8")

    portrait_crop = ImageOps.fit(portrait.convert("RGB"), (410, 520), method=Image.Resampling.LANCZOS, centering=(0.5, 0.28))
    mask = Image.new("L", portrait_crop.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 409, 519), radius=34, fill=255)
    canvas.paste(portrait_crop, (720, 55), mask)
    draw.rounded_rectangle((720, 55, 1129, 574), radius=34, outline="#334155", width=2)
    draw.rounded_rectangle((1050, 548, 1104, 554), radius=3, fill="#34d399")
    return canvas


def main() -> None:
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as source:
        portrait = crop_portrait(source)
        portrait.save(PROFILE_DIR / "glodi-mputu.avif", "AVIF", quality=55, speed=6)
        portrait.save(PROFILE_DIR / "glodi-mputu.webp", "WEBP", quality=82, method=6)
        portrait.save(
            PROFILE_DIR / "glodi-mputu.jpg",
            "JPEG",
            quality=88,
            optimize=True,
            progressive=True,
        )
        generate_social_image(portrait).save(
            ROOT / "public" / "og.jpg",
            "JPEG",
            quality=88,
            optimize=True,
            progressive=True,
        )

    for path in sorted(PROFILE_DIR.glob("glodi-mputu.*")):
        print(f"{path.name}: {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
