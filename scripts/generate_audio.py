"""
生成仿微信来电铃声 — 使用 FM 合成模拟马林巴/钢片琴音色

微信来电铃声特征：
- 钢片琴/马林巴音色（类似敲击乐器）
- 五声音阶下行旋律
- 每个音符有快速衰减的包络

使用 FM 合成（Frequency Modulation）来模拟打击乐器的泛音结构。
"""
import wave
import math
import struct
import os

SAMPLE_RATE = 44100
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'audio')

def fm_synth(freq, duration, sample_rate=SAMPLE_RATE, mod_ratio=3.5, mod_index=2.5):
    """
    FM合成一个音符
    - carrier: 基频
    - modulator: 基频 * mod_ratio （非整数倍产生更丰富的泛音）
    - mod_index: 调制指数，越大泛音越多
    """
    n_samples = int(sample_rate * duration)
    samples = []
    for i in range(n_samples):
        t = i / sample_rate
        # 包络：快速起音 + 指数衰减（模拟敲击乐器）
        envelope = math.exp(-t * 8.0)  # 衰减速度
        if t < 0.003:
            envelope *= t / 0.003  # 快速起音

        # FM合成
        modulator = math.sin(2 * math.pi * freq * mod_ratio * t)
        carrier = math.sin(2 * math.pi * freq * t + mod_index * modulator)

        # 添加少量高频泛音（奇数谐波）
        harmonic3 = 0.15 * math.sin(2 * math.pi * freq * 3 * t)
        harmonic5 = 0.05 * math.sin(2 * math.pi * freq * 5 * t)

        sample = (carrier + harmonic3 + harmonic5) * envelope
        samples.append(sample)

    return samples


def add_reverb(samples, decay=0.3, mix=0.25):
    """简单的延迟混响"""
    delay_samples = int(SAMPLE_RATE * 0.05)  # 50ms 延迟
    output = list(samples)
    for i in range(delay_samples, len(samples)):
        output[i] += samples[i - delay_samples] * decay
    # 归一化
    max_val = max(abs(s) for s in output)
    if max_val > 0.95:
        output = [s / max_val * 0.95 for s in output]
    return output


def generate_wechat_ringtone():
    """
    微信来电铃声 — 五声音阶下行旋律

    经典微信铃声旋律 (G大调五声音阶):
    每个"叮"声是一个短促的钢片琴音色
    """
    # 音符频率 (Hz) — G大调五声音阶
    notes = [
        (783.99, 0.15),   # G5
        (659.25, 0.15),   # E5
        (523.25, 0.20),   # C5
        (587.33, 0.15),   # D5
        (392.00, 0.30),   # G4 (最后一个音符更长)
    ]

    gap = 0.08  # 音符间间隔
    all_samples = []

    for freq, dur in notes:
        # 生成音符
        note_samples = fm_synth(freq, dur, mod_ratio=3.2, mod_index=1.8)
        all_samples.extend(note_samples)
        # 音符间静音
        gap_samples = [0.0] * int(SAMPLE_RATE * gap)
        all_samples.extend(gap_samples)

    # 添加混响
    all_samples = add_reverb(all_samples, decay=0.25, mix=0.2)

    # 段落间暂停（循环时在 JS 中处理，这里只放很短间隔）
    pause_dur = 0.2
    pause_samples = [0.0] * int(SAMPLE_RATE * pause_dur)
    all_samples.extend(pause_samples)

    # 写入 WAV
    wav_path = os.path.join(OUTPUT_DIR, 'wechat-ringtone.wav')
    with wave.open(wav_path, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        for sample in all_samples:
            # 量化到 16-bit
            val = int(max(-32767, min(32767, sample * 32767)))
            wf.writeframes(struct.pack('<h', val))

    size_kb = os.path.getsize(wav_path) / 1024
    duration = len(all_samples) / SAMPLE_RATE
    print(f'[Ringtone] Generated: {wav_path}')
    print(f'  Duration: {duration:.1f}s, Size: {size_kb:.0f}KB')
    return wav_path


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generate_wechat_ringtone()
    print('Done!')
