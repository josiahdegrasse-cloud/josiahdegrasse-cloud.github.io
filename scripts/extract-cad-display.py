"""Extract a saved SolidWorks display mesh without changing its geometry.

Usage: python scripts/extract-cad-display.py PART.SLDPRT OUTPUT.mesh
Reads locally; never edits or uploads the original. Uses only the standard library.
DisplayLists layout: cadmpeg project, docs/formats/sldprt.md (CC BY 4.0).
Reference implementation: cadmpeg tessellation.rs (Apache 2.0).
https://github.com/cadmpeg/cadmpeg
Only the modern compressed container and six-descriptor mesh format are supported.
An assembly can require separate part files; this is not a general CAD converter.
"""
import math
from pathlib import Path
import struct
import sys
import zlib


def display_stream(path):
    data = Path(path).read_bytes()
    marker = bytes.fromhex('140006000800')
    offset = 0
    while True:
        offset = data.find(marker, offset)
        if offset < 0:
            raise ValueError('No readable saved DisplayLists stream')
        start = offset
        offset += len(marker)
        if start + 26 > len(data):
            continue
        _, crc, compressed, expanded, name_size = struct.unpack_from('<IIIII', data, start + 6)
        if not (0 < name_size <= 1024 and compressed <= 64*1024*1024 and expanded <= 128*1024*1024):
            continue
        name_bytes = data[start+26:start+26+name_size]
        name = bytes(((b & 15) << 4) | (b >> 4) for b in name_bytes)
        if name != b'Contents/DisplayLists':
            continue
        begin = start + 26 + name_size
        if begin + compressed > len(data):
            continue
        try:
            payload = zlib.decompress(data[begin:begin+compressed], -15)
        except zlib.error:
            continue
        if len(payload) == expanded and zlib.crc32(payload) == crc:
            return payload


def mesh_tables(data):
    signature = struct.pack('<III', 4, 8, 2)
    expected = [(4,8),(12,100),(12,100),(4,8),(4,8),(1,8)]
    cursor = 0
    while cursor < len(data):
        start = data.find(signature, cursor)
        if start < 0:
            return
        cursor = start + 4
        offset = start
        arrays = []
        try:
            for size, kind in expected:
                item_size, item_kind, flags, count = struct.unpack_from('<IIII', data, offset)
                if (item_size,item_kind,flags) != (size,kind,2) or count > 1000000:
                    raise ValueError('Unsupported descriptor')
                offset += 16
                if offset + size*count > len(data):
                    raise ValueError('Incomplete table')
                arrays.append(data[offset:offset+size*count])
                offset += size*count
            strips = [v[0] for v in struct.iter_unpack('<I',arrays[0])]
            positions = list(struct.iter_unpack('<fff',arrays[1]))
            normals = list(struct.iter_unpack('<fff',arrays[2]))
            channel_c = [v[0] for v in struct.iter_unpack('<I',arrays[4])]
            if not strips or min(strips)<3 or sum(strips)!=len(positions) or len(positions)!=len(normals):
                raise ValueError('Invalid strip sizes')
            if channel_c != [2*n-2 for n in strips]:
                raise ValueError('Invalid source channel')
            edge_count = sum(channel_c)
            if (len(arrays[3]),len(arrays[5])) not in [(0,0),(edge_count*4,edge_count)]:
                raise ValueError('Invalid auxiliary channels')
            if not all(math.isfinite(x) for row in positions+normals for x in row):
                raise ValueError('Nonfinite geometry')
            triangles=[]
            base=0
            for length in strips:
                for i in range(length-2):
                    triangles.append((base+i,base+i+1,base+i+2) if i%2==0 else (base+i,base+i+2,base+i+1))
                base+=length
            cursor=offset
            yield positions,normals,triangles
        except (ValueError,struct.error):
            continue


def main():
    if len(sys.argv)!=3:
        raise SystemExit(__doc__)
    source,destination=map(Path,sys.argv[1:])
    positions=[]; normals=[]; triangles=[]
    for p,n,t in mesh_tables(display_stream(source)):
        base=len(positions)
        positions.extend(p); normals.extend(n)
        triangles.extend(tuple(index+base for index in face) for face in t)
    if not positions:
        raise SystemExit('No supported complete display mesh. Export STEP/GLB from the assembled model.')
    # Rigid reorientation: scoop up, throat down. Uniform scale only.
    positions=[(-x,-z,-y) for x,y,z in positions]
    normals=[(-x,-z,-y) for x,y,z in normals]
    low=[min(p[i] for p in positions) for i in range(3)]
    high=[max(p[i] for p in positions) for i in range(3)]
    center=[(a+b)/2 for a,b in zip(low,high)]
    scale=2.7/(high[1]-low[1])
    result=bytearray(struct.pack('<II',len(positions),len(triangles)*3))
    for p in positions:
        result.extend(struct.pack('<fff',*((p[i]-center[i])*scale for i in range(3))))
    for n in normals:
        magnitude=math.sqrt(sum(v*v for v in n))
        if magnitude<1e-8:
            raise ValueError('Invalid normal')
        result.extend(struct.pack('<fff',*(v/magnitude for v in n)))
    for t in triangles:
        result.extend(struct.pack('<III',*t))
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_bytes(result)
    print(f'{len(positions)} vertices; {len(triangles)} triangles; {len(result)} bytes')


if __name__=='__main__':
    main()
