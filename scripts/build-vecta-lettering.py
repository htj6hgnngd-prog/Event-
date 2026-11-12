"""Original pointed-pen Cyrillic display study for VECTA.

All centerlines below are drawn for this project. No font outlines are imported.
One asymmetric pen model unifies letters; bespoke word forms carry longer swashes.
This is a display cut, not a general-purpose text family.
"""
from pathlib import Path
import math, json
import numpy as np
from svgpathtools import parse_path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'lettering'
OUT.mkdir(parents=True, exist_ok=True)

# Baseline is 0, x-height 310, ascenders 700. Coordinates are before pen slant.
A = 'M190 -295 C70 -370 -28 -183 5 -45 C31 54 151 -14 188 -148 C207 -218 215 -300 190 -295'
O = 'M160 -310 C45 -359 -37 -157 13 -43 C55 55 169 -12 191 -155 C211 -268 190 -321 160 -310'
U = 'M-20 -50 C15 -112 42 -270 63 -310 C83 -342 78 -262 65 -200 L34 -70 C11 37 77 28 133 -70 C175 -140 189 -253 206 -310 L149 -71 C123 40 187 24 245 -71'
N = 'M-18 -51 C17 -112 41 -258 59 -310 L4 -14 C29 -147 83 -311 141 -310 C196 -309 174 -214 154 -130 L137 -54 C121 15 170 20 215 -55'
E = 'M-18 -45 C27 -79 151 -144 156 -232 C164 -358 28 -311 6 -172 C-19 -25 72 31 188 -71'
glyphs = {
 'а': (255,[A,'M210 -315 L155 -56 C139 22 203 24 258 -71']),
 'б': (270,['M211 -675 C144 -741 49 -636 53 -536 C58 -450 150 -453 214 -502 C154 -434 36 -336 13 -158 C-9 -9 91 34 159 -34 C244 -119 226 -328 118 -297 C37 -274 17 -170 21 -99']),
 'в': (250,['M-10 -36 C36 -144 173 -565 162 -648 C150 -741 69 -684 56 -574 C42 -455 85 -325 153 -332 C219 -339 224 -428 183 -422 C151 -415 143 -352 156 -307 C170 -266 245 -225 211 -121 C178 -18 40 45 45 -71 C48 -141 143 -194 201 -175']),
 'г': (205,['M-18 -55 C35 -154 85 -323 134 -314 C199 -301 145 -230 84 -190 C13 -143 -14 -76 15 -32 C49 21 133 0 205 -66']),
 'д': (265,[A,'M213 -318 L100 254 C82 349 -31 406 -62 337 C-90 272 19 184 117 174 C218 165 277 116 290 31']),
 'е': (215,[E]),
 'ё': (215,[E,'M64 -421 L66 -434','M144 -421 L146 -434']),
 'ж': (395,['M-20 -300 C36 -363 127 -258 114 -130 C103 -31 22 10 -9 -42','M199 -320 L124 -13','M334 -319 C253 -369 188 -258 200 -135 C212 -35 289 12 352 -55','M42 -171 C136 -105 214 -198 313 -163']),
 'з': (235,['M-15 -236 C67 -352 199 -342 188 -228 C182 -155 101 -135 58 -146 C125 -182 222 -133 179 -37 C141 50 15 51 -12 -18 C-32 -67 33 -94 52 -56','M181 -45 C176 106 75 225 -19 235']),
 'и': (275,[U]),
 'й': (275,[U,'M75 -465 C91 -413 161 -415 191 -473']),
 'к': (270,['M-20 -44 C57 -171 174 -573 154 -648 C133 -729 61 -662 65 -566 C69 -471 103 -379 122 -319 L46 -14','M62 -125 C164 -353 257 -357 239 -266 C224 -190 138 -170 98 -170 C184 -164 132 47 260 -67']),
 'л': (255,['M-35 -16 C30 34 66 -98 107 -215 L140 -310 L102 -74 C79 41 177 14 242 -65']),
 'м': (390,['M-34 -22 C23 27 61 -112 109 -310 L91 -27 L244 -309 L202 -61 C185 24 258 18 314 -57']),
 'н': (280,['M-15 -51 C22 -107 49 -259 68 -310 L10 -13','M203 -311 L145 -65 C128 22 196 24 251 -67','M42 -154 C90 -174 134 -170 177 -159']),
 'о': (235,[O,'M177 -105 C226 -113 249 -150 260 -188']),
 'п': (255,[N]),
 'р': (255,['M-17 -57 C19 -122 53 -268 70 -312 L-52 304','M25 -98 C70 -251 140 -351 199 -301 C272 -239 189 -3 90 -11 C31 -16 42 -94 80 -115']),
 'с': (218,['M184 -262 C206 -330 136 -342 81 -292 C9 -224 -26 -63 37 -17 C91 23 168 -23 222 -90']),
 'т': (405,['M-18 -51 C17 -112 41 -258 59 -310 L4 -14 C29 -147 83 -311 141 -310 C187 -309 153 -186 127 -72 L112 -14 C146 -161 207 -317 260 -311 C302 -307 280 -200 259 -111 L247 -54 C228 21 297 17 342 -65']),
 'у': (265,['M-13 -52 C32 -141 50 -266 70 -311 L16 -80 C-3 14 63 32 126 -67 C161 -122 180 -239 201 -314 L81 272 C61 366 -39 399 -65 330 C-91 259 -5 192 102 176 C187 163 229 111 250 40']),
 'ф': (345,['M186 -689 L-10 282','M134 -309 C29 -345 -43 -185 -9 -70 C21 35 133 -9 168 -122 C209 -263 163 -362 134 -309','M177 -125 C224 -286 305 -344 337 -270 C385 -162 280 11 213 -7 C179 -15 171 -64 177 -125']),
 'х': (270,['M-13 -251 C36 -332 111 -331 132 -250 C151 -176 121 -60 153 -25 C185 9 238 -36 273 -85','M247 -300 C174 -361 150 -271 113 -149 C81 -44 41 21 -10 -26']),
 'ц': (295,[U,'M239 -72 C211 46 201 163 222 192 C243 153 263 67 271 15']),
 'ч': (255,['M-14 -250 C12 -311 69 -338 76 -288 C81 -250 35 -166 56 -133 C75 -98 131 -129 182 -204','M203 -310 L148 -61 C130 23 195 24 251 -68']),
 'ш': (405,[U.replace('245 -71','236 -71'),'M206 -310 L149 -71 C123 40 187 24 245 -71 C280 -133 309 -267 326 -311 L269 -62 C250 22 321 23 379 -68']),
 'щ': (435,[U,'M206 -310 L149 -71 C123 40 187 24 245 -71 C280 -133 309 -267 326 -311 L269 -62 C250 22 321 23 379 -68','M373 -69 C352 33 334 153 356 192 C376 147 397 70 406 13']),
 'ъ': (300,['M-25 -285 C26 -337 69 -330 75 -279 C79 -235 49 -151 32 -88 C3 20 105 31 165 -19 C227 -69 208 -159 150 -150 C89 -140 60 -53 88 -24','M176 -34 C231 -49 268 -78 293 -108']),
 'ы': (395,['M42 -312 L-14 -77 C-39 27 63 34 125 -19 C183 -69 167 -152 110 -148 C45 -141 18 -54 48 -23','M248 -311 L190 -66 C171 22 235 23 293 -67']),
 'ь': (240,['M42 -312 L-14 -77 C-39 27 63 34 125 -19 C183 -69 167 -152 110 -148 C45 -141 18 -54 48 -23','M138 -36 C193 -51 220 -83 239 -111']),
 'э': (235,['M8 -251 C85 -356 200 -325 189 -196 C178 -68 64 46 -11 -26 C-36 -54 5 -85 22 -60','M56 -166 C112 -175 153 -171 181 -162']),
 'ю': (375,['M41 -310 L-17 -14','M15 -160 C64 -187 96 -181 140 -164','M286 -309 C171 -358 89 -156 139 -42 C181 56 295 -11 317 -154 C337 -267 316 -320 286 -309']),
 'я': (270,['M181 -298 C88 -357 -3 -263 19 -178 C34 -119 119 -130 171 -209','M207 -310 L149 -63 C131 21 198 24 253 -69','M142 -157 C90 -102 88 12 14 -12 C-17 -23 -11 -58 12 -64']),
}

caps = {
 'С':(500,['M464 -548 C481 -751 168 -824 18 -619 C-132 -414 -59 -73 129 -7 C275 45 443 -51 509 -215','M459 -553 C487 -706 300 -770 123 -696 C-81 -611 -280 -428 -454 -466 C-626 -504 -502 -703 -341 -680 C-217 -661 -264 -561 -334 -577']),
 'П':(570,['M105 -651 L-21 2','M461 -653 L335 -3','M-158 -578 C70 -794 300 -602 568 -674 C771 -728 714 -865 559 -834 C407 -805 358 -678 383 -592','M-21 2 C52 -36 122 -31 180 -4']),
 'З':(510,['M-47 -520 C87 -764 422 -779 405 -540 C392 -374 207 -337 90 -343 C250 -403 468 -276 369 -85 C286 77 25 62 -51 -30 C-122 -116 15 -189 51 -104','M329 -47 C502 89 688 108 738 15 C788 -81 644 -157 542 -86']),
 'И':(590,['M-109 -531 C-58 -743 143 -776 145 -614 C147 -494 29 -251 37 -104 C48 105 256 -28 350 -251 L461 -660 L329 -97 C290 67 428 53 552 -106','M-104 -532 C-166 -423 -312 -399 -355 -498 C-403 -611 -221 -712 -57 -686 C115 -658 279 -784 426 -728 C518 -692 472 -609 422 -625']),
 'В':(520,['M121 -674 C78 -439 9 -205 -25 8','M-208 -588 C-77 -744 240 -817 389 -681 C502 -578 395 -381 176 -376 C321 -449 529 -346 452 -159 C379 21 98 94 32 -53 C-4 -137 102 -222 180 -162','M-208 -588 C-298 -497 -433 -516 -432 -601 C-431 -727 -170 -797 2 -738','M-25 8 C66 76 222 108 387 58 C600 -5 644 -171 513 -208']),
}

def simplify(points, tolerance=.55):
    # Preserve the outline to below one display pixel while reducing transfer size.
    a=np.asarray(points); keep={0,len(a)-1}; stack=[(0,len(a)-1)]
    while stack:
        lo,hi=stack.pop()
        if hi-lo<2:continue
        p=a[lo];v=a[hi]-p;vv=float(np.dot(v,v))
        q=a[lo+1:hi]
        if vv<1e-9:d=np.linalg.norm(q-p,axis=1)
        else:
            t=np.clip(((q-p)@v)/vv,0,1)
            d=np.linalg.norm(q-(p+t[:,None]*v),axis=1)
        i=int(np.argmax(d))
        if d[i]>tolerance:
            at=lo+1+i;keep.add(at);stack.extend([(lo,at),(at,hi)])
    return [points[i] for i in sorted(keep)]

def strokes_to_polygons(strokes, xoff=0, scale=1):
    polygons=[]
    for d in strokes:
        path=parse_path(d)
        for sub in path.continuous_subpaths():
            pts=[]; widths=[]
            # A dense outline stays smooth at large display sizes.
            segments=list(sub)
            for si,seg in enumerate(segments):
                for t in np.linspace(0,1,60,endpoint=si==len(segments)-1):
                    p=seg.point(t); v=seg.derivative(t)
                    norm=max(abs(v),.001)
                    down=max(0,v.imag/norm)
                    width=3.2+42*down**1.4
                    pts.append(p);widths.append(width)
            if len(pts)<2:continue
            left=[];right=[]
            for i,p in enumerate(pts):
                v=pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)]
                n=complex(-v.imag,v.real)/max(abs(v),.001)
                taper=min(1,(i+1)/5,(len(pts)-i)/5)
                w=widths[i]*max(.06,taper)/2
                def transform(z):
                    # Long, narrow, steeply oblique pen: 57 degrees to baseline.
                    return ((z.real-.64*z.imag)*scale+xoff,z.imag*scale)
                left.append(transform(p+n*w));right.append(transform(p-n*w))
            polygons.append(simplify(left+right[::-1]))
    return polygons

def word_polygons(text, bespoke=True):
    result=[];x=0
    for c in text:
        adv,st= caps[c] if c in caps else glyphs[c]
        result+=strokes_to_polygons(st,x)
        x+=adv
    # Flourishes grow out of the final pen lift, not an independent floral badge.
    if bespoke:
        sweeps={
          'Студия':[f'M{x-130} -36 C{x+80} -234 {x+380} -130 {x+275} 36 C{x+208} 140 {x-48} 161 {x-230} 82 C{x-450} -14 {x-610} 3 {x-749} 111'],
          'Подход':[f'M{x-55} -47 C{x+190} -179 {x+404} -84 {x+291} 83 C{x+161} 276 {x-130} 244 {x-357} 138'],
          'Запрос':[f'M{x-45} -30 C{x+211} -233 {x+376} -124 {x+260} 68 C{x+135} 275 {x-199} 246 {x-399} 144'],
          'Векта':[f'M{x-30} -37 C{x+228} -267 {x+638} -197 {x+485} 37 C{x+298} 324 {x-355} 236 {x-734} 89'],
          'Избранное':[f'M{x-30} -24 C{x+130} -182 {x+399} -155 {x+310} 18 C{x+226} 182 {x-25} 208 {x-243} 126'],
        }
        result+=strokes_to_polygons(sweeps.get(text,[]))
    return result

def bounds(polygons):
    points=[p for poly in polygons for p in poly]
    return min(x for x,y in points),min(y for x,y in points),max(x for x,y in points),max(y for x,y in points)

def path_data(polygons):
    return ''.join('M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in poly)+'Z' for poly in polygons)

words={'vecta':'Векта','studio':'Студия','approach':'Подход','request':'Запрос','selected':'Избранное'}
word_shapes={}
for key,text in words.items():
    polys=word_polygons(text);word_shapes[key]=polys
    x0,y0,x1,y1=bounds(polys);pad=20
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" class="vecta-lettering lettering-{key}" viewBox="{x0-pad:.1f} {y0-pad:.1f} {x1-x0+pad*2:.1f} {y1-y0+pad*2:.1f}" aria-hidden="true" focusable="false"><path fill="currentColor" d="{path_data(polys)}"/></svg>'
    (OUT/f'{key}.svg').write_text(svg)

# A reproducible font companion: every Russian lowercase letter, display capitals,
# punctuation, and bespoke phrase ligatures. Font is supplementary to fixed SVG art.
fb=FontBuilder(1000,isTTF=True)
gmap={};polymap={'.notdef':[], 'space':[]};advances={'.notdef':400,'space':180}
for ch,(adv,st) in glyphs.items():
    name=f'uni{ord(ch):04X}';gmap[ord(ch)]=name;polymap[name]=strokes_to_polygons(st);advances[name]=adv
    up=ch.upper();uname=f'uni{ord(up):04X}';gmap[ord(up)]=uname
    a,s=caps[up] if up in caps else (adv*1.45,st)
    polymap[uname]=strokes_to_polygons(s,scale=1 if up in caps else 1.45);advances[uname]=a
gmap[32]='space'
for key,polys in word_shapes.items():
    # Shift swashes into the advance so CSS cannot create accidental overflow.
    x0,y0,x1,y1=bounds(polys);polymap['word.'+key]=[[(x-x0+15,y) for x,y in p] for p in polys];advances['word.'+key]=x1-x0+30
order=list(polymap);fb.setupGlyphOrder(order);fb.setupCharacterMap(gmap)
out={};metrics={}
for name,polys in polymap.items():
    pen=TTGlyphPen(None)
    for poly in polys:
        pen.moveTo((round(poly[0][0]),round(-poly[0][1])))
        for x,y in poly[1:]:pen.lineTo((round(x),round(-y)))
        pen.closePath()
    out[name]=pen.glyph();metrics[name]=(round(advances[name]),round(min((p[0] for a in polys for p in a),default=0)))
fb.setupGlyf(out);fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=950,descent=-460)
fb.setupNameTable({'familyName':'VECTA Pen Display','styleName':'Oblique','uniqueFontIdentifier':'VECTA Pen Display v0.1','fullName':'VECTA Pen Display Oblique','psName':'VECTAPenDisplay-Oblique','version':'Version 0.1; display study'})
fb.setupOS2(sTypoAscender=950,sTypoDescender=-460,usWinAscent=1000,usWinDescent=480,sxHeight=310,sCapHeight=700)
fb.setupPost(italicAngle=-32);fb.setupMaxp()
features='languagesystem DFLT dflt; languagesystem cyrl dflt; feature liga {'
for key,text in words.items():features+='sub '+' '.join(gmap[ord(c)] for c in text)+' by word.'+key+';'
features+='} liga;'
addOpenTypeFeaturesFromString(fb.font,features)
fb.font.save(ROOT/'fonts/vecta-pen-display.ttf')
fb.font.flavor='woff2';fb.font.save(ROOT/'fonts/vecta-pen-display.woff2')
(OUT/'manifest.json').write_text(json.dumps({key:{'text':text,'bounds':bounds(word_shapes[key])} for key,text in words.items()},ensure_ascii=False,indent=2))
print('Original display cut and five bespoke word drawings built.')
