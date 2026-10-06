import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont('src/fonts/Satoshi-Variable.woff2')
static_font = instantiateVariableFont(font, {'wght': 800})
glyph_set = static_font.getGlyphSet()
cmap = static_font.getBestCmap()

# Extract uppercase letters
letters = {}
for char in 'SENTIL':
    gname = cmap[ord(char)]
    glyph = glyph_set[gname]
    
    # Calculate bounds
    bp = BoundsPen(glyph_set)
    glyph.draw(bp)
    xmin, ymin, xmax, ymax = bp.bounds
    
    # Transform: flip Y and translate so baseline is at y=740
    pen = SVGPathPen(glyph_set)
    tpen = TransformPen(pen, (1, 0, 0, -1, 0, 740))
    glyph.draw(tpen)
    
    letters[char] = {
        'width': glyph.width,
        'd': pen.getCommands(),
        'bounds': [xmin, 740 - ymax, xmax, 740 - ymin] # transformed bounds
    }

# Also extract full SENTINEL wordmark
word = 'SENTINEL'
tracking = 50
cur_x = 0
word_paths = []
for char in word:
    gname = cmap[ord(char)]
    glyph = glyph_set[gname]
    pen = SVGPathPen(glyph_set)
    tpen = TransformPen(pen, (1, 0, 0, -1, cur_x, 740))
    glyph.draw(tpen)
    word_paths.append(pen.getCommands())
    cur_x += glyph.width + tracking

word_width = cur_x - tracking

print(f"Extracted {len(letters)} letters. Wordmark width: {word_width}")
with open('scripts/extracted_glyphs.json', 'w') as f:
    json.dump({
        'letters': letters,
        'wordmark': {
            'word': word,
            'd': ' '.join(word_paths),
            'width': word_width,
            'height': 740
        }
    }, f, indent=2)
