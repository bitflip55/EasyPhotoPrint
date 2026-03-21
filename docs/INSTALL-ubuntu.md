# Ubuntu Installation

## Download

- [Release page](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Direct `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.2/Easy.Photo.Print_0.1.2_amd64.deb)
- [Direct `.rpm` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.2/Easy.Photo.Print-0.1.2-1.x86_64.rpm)

## Install On Ubuntu

Install the required runtime packages once:

```bash
sudo apt update
sudo apt install -y \
  libgtk-3-0 \
  libwebkit2gtk-4.1-0 \
  libjavascriptcoregtk-4.1-0 \
  libsoup-3.0-0 \
  libayatana-appindicator3-1 \
  libxdo3 \
  cups
```

Download and install the `.deb` package:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.2/Easy.Photo.Print_0.1.2_amd64.deb"
sudo apt install "./Easy.Photo.Print_0.1.2_amd64.deb"
```

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
