# QEMU-GDB Debugging

This extension provides a workflow for debugging QEMU using GDB.

## Features

The extension prevents GDB being blocked by QEMU, so GDB can run as-is, and activate QEMU. It allows debugging in a VSCode session.

## Requirements

Tested on:
* Ubuntu x86_64 22.04
* QEMU x86_64 6.2.0
* GDB 12.1

## Extension Settings

These settings can be specified:
* `qemu-gdb-debug.startQemuCommand`: QEMU start command

Example: `qemu-system-i386 -s -S -drive file=image.elf,index=0,if=floppy,format=raw`
<br/><br/>

* `qemu-gdb-debug.stopQemuCommand`: QEMU stop command (can be omitted for not stopping)

Example: `pkill -f qemu-system-i386`
<br/><br/>

* `qemu-gdb-debug.serverAddress`: GDB server address (localhost:1234 by default in QEMU)

Example: `localhost:1234`
<br/><br/>

* `qemu-gdb-debug.gdbPath`: GDB path

Example: `/usr/bin/gdb`
<br/><br/>

* `qemu-gdb-debug.executablePath`: Executable path (generally same as the one QEMU runs)

Example: `${workspaceFolder}/bin/kernel.elf`


## Release Notes

### 1.0.0

Initial release

## Attribution
Icon by kliwir
<a href="https://www.flaticon.com/free-icons/debug" title="debug icons">Debug icons created by kliwir art - Flaticon</a>