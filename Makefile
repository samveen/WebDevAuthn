.PHONY: all clean build

all:
	@echo "Be specific, not lazy"

clean:
	rm -vf WebAuthnLinux-Extension.xpi

build: clean
	(cd extension && zip -r ../WebAuthnLinux-Extension.xpi .)
