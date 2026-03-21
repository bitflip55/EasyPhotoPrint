# Ubuntu Installation

## Download

- [Release page](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Direct `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.3/Easy.Photo.Print_0.1.3_amd64.deb)
- [Direct `.rpm` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.3/Easy.Photo.Print-0.1.3-1.x86_64.rpm)

## Install On Ubuntu

Download and install the `.deb` package with `apt`:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.3/Easy.Photo.Print_0.1.3_amd64.deb"
sudo apt install "./Easy.Photo.Print_0.1.3_amd64.deb"
```

`apt` resolves the package dependencies automatically on a normal Ubuntu system.

## Start The App

Start `Easy Photo Print` from:

- the Ubuntu app launcher
- or a terminal:

```bash
easy-photo-print
```

## Printing

Printing uses the system `lp` command through CUPS. If printing does not work yet:

```bash
sudo systemctl enable --now cups
lpstat -p -d
```

## Quick Check

1. App starts.
2. Bilder lassen sich lokal laden.
3. Mehrseiten-Vorschau funktioniert.
4. PDF-Export funktioniert.
5. Drucken mit mehreren Exemplaren funktioniert.
