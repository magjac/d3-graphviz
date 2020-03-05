#!/usr/bin/python3

bytes = []
with open("node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm", "rb") as f:
    byte = f.read(1)
    while byte != b"":
        bytes.append(ord(byte));
        byte = f.read(1)
    print('export var wasmCode = new Int8Array(' + str(bytes) + ');')
