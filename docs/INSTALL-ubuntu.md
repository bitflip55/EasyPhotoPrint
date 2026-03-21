# Ubuntu Installation

## Download

- [Release page](https://github.com/bitflip55/EasyPhotoPrint/releases)
- [Direct `.deb` download](https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.23/EasyPhotoPrint_0.1.23_amd64.deb)

## Install On Ubuntu

Download and install the `.deb` package with `apt`:

```bash
wget "https://github.com/bitflip55/EasyPhotoPrint/releases/download/v0.1.23/EasyPhotoPrint_0.1.23_amd64.deb"
sudo apt install "./EasyPhotoPrint_0.1.23_amd64.deb"
```

`apt` resolves the package dependencies automatically on a normal Ubuntu system.

## Start The App

Start `EasyPhotoPrint` from:

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
