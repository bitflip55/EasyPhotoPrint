# Ubuntu Installation

## Download

- [Release page](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Direct `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.5/Easy.Photo.Print_0.1.5_amd64.deb)
- [Direct `.rpm` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.5/Easy.Photo.Print-0.1.5-1.x86_64.rpm)

## Install On Ubuntu

Download and install the `.deb` package with `apt`:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.5/Easy.Photo.Print_0.1.5_amd64.deb"
sudo apt install "./Easy.Photo.Print_0.1.5_amd64.deb"
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
2. Local image import works.
3. Multi-page preview works.
4. PDF export works.
5. Printing with multiple copies works.
