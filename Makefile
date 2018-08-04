# Makefile

TRUFFLE=docker run --rm -v $${PWD}:/data -w /data 900df00d/truffle:latest truffle
ifeq "$(DEST)" ""
	DEST_NET = --network metadium
else
	DEST_NET = --network $(DEST)
endif

all: build

build:
	$(TRUFFLE) compile

install: migrate

migrate: build
	$(TRUFFLE) migrate $(DEST_NET)

clean:
	@[ ! -d build ] || \rm -r build

.PHONY: build clean

# EOF
