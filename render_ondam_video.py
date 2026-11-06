#!/usr/bin/env python3
import math
import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT = 1280, 720
FPS = 30
DURATION = 37.0
ROOT = Path('/home/suck/ondam_homepage')
FONT_REGULAR = '/tmp/ondam_fonts/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FONT_BOLD = '/tmp/ondam_fonts/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'

SCENES = [
    (0.0, 3.2, None, 'ONDAM AI', 'Enterprise AI Control Platform', False),
    (3.2, 7.8, '/tmp/ondam_dashboard.png', '기업의 모든 AI를', '하나의 플랫폼에 온전히 담다', False),
    (7.8, 12.8, '/tmp/ondam_discover.png', 'Discover', '보이지 않던 AI까지 먼저 발견합니다', False),
    (12.8, 17.8, '/tmp/ondam_control.png', 'Control', '하나의 정책으로 모든 AI 사용을 통제합니다', False),
    (17.8, 22.8, '/tmp/ondam_security.png', 'Protect', '외부 AI 사용까지 안전하게 관리합니다', True),
    (22.8, 26.8, '/tmp/ondam_manage.png', 'Manage', 'AI App과 Agent를 검토하고 운영합니다', True),
    (26.8, 30.5, '/tmp/ondam_store.png', 'AI App Store', '검증된 AI를 조직 전체가 활용합니다', False),
    (30.5, 33.5, '/tmp/ondam_chat.png', 'ONDAM AI', '기업의 업무와 연결된 AI 경험', False),
    (33.5, 37.0, None, '기업의 모든 AI를', '온전히 담다 · ONDAM AI', True),
]


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3.0 - 2.0 * x)


def alpha_ramp(local, length, edge=0.55):
    return min(1.0, local / edge, (length - local) / edge)


def make_background(t, dark=False):
    sw, sh = 320, 180
    yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
    if dark:
        base = np.zeros((sh, sw, 3), np.float32)
        base[:] = (18, 18, 31)
        colors = [((55 + 25 * math.sin(t * .25), 135), (146, 57, 255), 1.0),
                  ((245, 65 + 20 * math.cos(t * .3)), (255, 48, 125), .72),
                  ((170, 245), (45, 164, 255), .62)]
    else:
        base = np.zeros((sh, sw, 3), np.float32)
        base[:] = (248, 249, 255)
        colors = [((55 + 30 * math.sin(t * .22), 145), (255, 115, 203), .34),
                  ((255, 45 + 30 * math.cos(t * .27)), (62, 156, 255), .34),
                  ((145, 240), (54, 224, 255), .20)]
    for (cx, cy), color, strength in colors:
        sigma = 70.0 if not dark else 58.0
        g = np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma * sigma))[:, :, None]
        c = np.array(color[::-1], np.float32)[None, None, :]
        base = base * (1 - g * strength) + c * (g * strength)
    base = np.clip(base, 0, 255).astype(np.uint8)
    return cv2.resize(base, (WIDTH, HEIGHT), interpolation=cv2.INTER_CUBIC)


def load_rgba(path):
    img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(path)
    if img.shape[2] == 3:
        alpha = np.full(img.shape[:2] + (1,), 255, np.uint8)
        img = np.concatenate([img, alpha], axis=2)
    return img


def overlay_rgba(frame, rgba, x, y, opacity=1.0):
    h, w = rgba.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(WIDTH, x + w), min(HEIGHT, y + h)
    if x0 >= x1 or y0 >= y1:
        return
    crop = rgba[y0-y:y1-y, x0-x:x1-x]
    a = crop[:, :, 3:4].astype(np.float32) / 255.0 * opacity
    frame[y0:y1, x0:x1] = (crop[:, :, :3] * a + frame[y0:y1, x0:x1] * (1-a)).astype(np.uint8)


def rounded_screen(path, scale, angle, x_shift, y_shift, dark):
    src = cv2.imread(path, cv2.IMREAD_COLOR)
    target_w = int(1110 * scale)
    target_h = int(target_w * 0.625)
    src = cv2.resize(src, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    mask = np.zeros((target_h, target_w), np.uint8)
    cv2.rectangle(mask, (20, 0), (target_w-20, target_h), 255, -1)
    cv2.rectangle(mask, (0, 20), (target_w, target_h-20), 255, -1)
    cv2.circle(mask, (20, 20), 20, 255, -1)
    cv2.circle(mask, (target_w-20, 20), 20, 255, -1)
    cv2.circle(mask, (20, target_h-20), 20, 255, -1)
    cv2.circle(mask, (target_w-20, target_h-20), 20, 255, -1)
    rgba = np.dstack([src, mask])
    center = (target_w/2, target_h/2)
    m = cv2.getRotationMatrix2D(center, angle, 1.0)
    corners = np.array([[0,0],[target_w,0],[0,target_h],[target_w,target_h]], np.float32)
    tc = cv2.transform(corners[None, :, :], m)[0]
    minx, miny = tc.min(axis=0); maxx, maxy = tc.max(axis=0)
    m[:,2] -= (minx, miny)
    rgba = cv2.warpAffine(rgba, m, (int(maxx-minx), int(maxy-miny)), flags=cv2.INTER_CUBIC,
                          borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))
    x = (WIDTH-rgba.shape[1])//2 + int(x_shift)
    y = 105 + int(y_shift)
    return rgba, x, y


def draw_text(frame, title, subtitle, opacity, dark, intro=False):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    im = Image.fromarray(rgb).convert('RGBA')
    layer = Image.new('RGBA', im.size, (0,0,0,0))
    d = ImageDraw.Draw(layer)
    if intro:
        title_font = ImageFont.truetype(FONT_BOLD, 66)
        sub_font = ImageFont.truetype(FONT_REGULAR, 27)
        tb = d.textbbox((0,0), title, font=title_font)
        sb = d.textbbox((0,0), subtitle, font=sub_font)
        x1 = (WIDTH-(tb[2]-tb[0]))//2
        x2 = (WIDTH-(sb[2]-sb[0]))//2
        color = (255,255,255,int(255*opacity)) if dark else (17,24,50,int(255*opacity))
        subc = (196,210,255,int(235*opacity)) if dark else (75,95,132,int(235*opacity))
        d.text((x1, 382), title, font=title_font, fill=color)
        d.text((x2, 470), subtitle, font=sub_font, fill=subc)
    else:
        title_font = ImageFont.truetype(FONT_BOLD, 48)
        sub_font = ImageFont.truetype(FONT_REGULAR, 24)
        d.rounded_rectangle((44,38,770,128), radius=24,
                            fill=(10,17,42,int(192*opacity)) if dark else (255,255,255,int(222*opacity)))
        tc = (255,255,255,int(255*opacity)) if dark else (15,27,60,int(255*opacity))
        sc = (187,210,255,int(245*opacity)) if dark else (55,96,168,int(245*opacity))
        d.text((70,47), title, font=title_font, fill=tc)
        d.text((72,101), subtitle, font=sub_font, fill=sc)
    im = Image.alpha_composite(im, layer).convert('RGB')
    return cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)


SYMBOL = load_rgba('/home/suck/ondam_ai/public/simbol.png')


def render_scene(scene, t):
    start, end, image_path, title, subtitle, dark = scene
    local = t - start
    length = end - start
    p = ease(local / length)
    frame = make_background(t, dark)
    fade = max(0.0, min(1.0, alpha_ramp(local, length)))
    if image_path:
        scale = 0.94 + 0.055*p
        angle = (1.0 if dark else -0.8) * (1.0-p) + 0.12*math.sin(t*.8)
        sx = 34*math.sin(p*math.pi) * (-1 if dark else 1)
        sy = 22*(1-p)
        rgba, x, y = rounded_screen(image_path, scale, angle, sx, sy, dark)
        shadow = np.zeros((HEIGHT, WIDTH), np.uint8)
        rh, rw = rgba.shape[:2]
        cv2.rectangle(shadow, (max(0,x+18), max(0,y+22)), (min(WIDTH-1,x+rw+18), min(HEIGHT-1,y+rh+22)), 130, -1)
        shadow = cv2.GaussianBlur(shadow, (0,0), 28)
        a = (shadow.astype(np.float32)/255.0*.38*fade)[:,:,None]
        frame = (frame*(1-a)).astype(np.uint8)
        overlay_rgba(frame, rgba, x, y, fade)
        frame = draw_text(frame, title, subtitle, fade, dark, False)
    else:
        size = int((190 if start < 1 else 150) * (0.92 + .08*ease(min(1,local/1.5))))
        symbol = cv2.resize(SYMBOL, (size,size), interpolation=cv2.INTER_LANCZOS4)
        bob = int(7*math.sin(t*2.1))
        overlay_rgba(frame, symbol, (WIDTH-size)//2, 158+bob, fade)
        glow = np.zeros_like(frame)
        cv2.circle(glow, (WIDTH//2, 158+bob+size//2), int(size*.62), (255,140,55), -1)
        glow = cv2.GaussianBlur(glow, (0,0), 55)
        frame = cv2.addWeighted(frame, 1, glow, .18*fade, 0)
        frame = draw_text(frame, title, subtitle, fade, dark, True)
    return frame


def main():
    temp = ROOT / 'ondam_product_film_v1_silent.mp4'
    writer = cv2.VideoWriter(str(temp), cv2.VideoWriter_fourcc(*'mp4v'), FPS, (WIDTH, HEIGHT))
    if not writer.isOpened():
        raise RuntimeError('Could not open video writer')
    total = int(DURATION*FPS)
    for i in range(total):
        t = i/FPS
        idx = next(j for j,s in enumerate(SCENES) if s[0] <= t < s[1])
        current = render_scene(SCENES[idx], t)
        transition = 0.62
        if idx + 1 < len(SCENES) and t > SCENES[idx][1] - transition:
            mix = ease((t-(SCENES[idx][1]-transition))/transition)
            nxt = render_scene(SCENES[idx+1], SCENES[idx+1][0] + mix*transition)
            current = cv2.addWeighted(current, 1-mix, nxt, mix, 0)
        writer.write(current)
        if i % (FPS*5) == 0:
            print(f'{i/FPS:05.1f}s / {DURATION:.1f}s', flush=True)
    writer.release()
    print(temp)


if __name__ == '__main__':
    main()
