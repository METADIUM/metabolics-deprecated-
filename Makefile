# Makefile

ifeq "$(shell uname -s)" "Darwin"
	TRUFFLE = docker run -e "HOME=/tmp" --rm -v $${PWD}:/data -w /data 900df00d/truffle:latest truffle
else
	TRUFFLE = docker run -e "HOME=/tmp" -u $(shell id -u):$(shell id -g) --rm -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v $${PWD}:/data -w /data 900df00d/truffle:latest truffle
endif

ifeq "$(DEST)" ""
	DEST_NET = --network metadium
else
	DEST_NET = --network $(DEST)
endif

all: build

build: check_submodule
	$(TRUFFLE) compile

install: migrate

migrate: build
	$(TRUFFLE) migrate $(DEST_NET)

check_submodule: contracts/openzeppelin-solidity/.git

contracts/openzeppelin-solidity/.git:
	git submodule init
	git submodule update

clean:
	@[ ! -d build ] || \rm -r build

.PHONY: build clean

# EOF
