# Makefile

TRUFFLE_IMAGE = metadium/meta-web3:0.1

ifeq "$(shell uname -s)" "Darwin"
	TRUFFLE = docker run -it -e "HOME=/tmp" --rm -v $${PWD}:/data -w /data $(TRUFFLE_IMAGE) truffle
	NODEJS = docker run -it -e "HOME=/tmp" --rm -v $${PWD}:/data -w /data $(TRUFFLE_IMAGE) nodejs
else
	TRUFFLE = docker run -it -e "HOME=/tmp" -u $(shell id -u):$(shell id -g) --rm -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v $${PWD}:/data -w /data $(TRUFFLE_IMAGE) truffle
	NODEJS = docker run -it -e "HOME=/tmp" -u $(shell id -u):$(shell id -g) --rm -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v $${PWD}:/data -w /data $(TRUFFLE_IMAGE) nodejs
endif

ifeq "$(DEST)" ""
	DEST_NET = --network metadium
else
	DEST_NET = --network $(DEST)
endif

all: build

build: check_submodule
	$(TRUFFLE) compile
	@[ -d build/js ] || mkdir -p build/js
	@echo ".sol -> .js..."
	@for i in `ls -1 contracts/*.sol`; do                             \
	  j=$${i/contracts/js};                                           \
	  scripts/json2js.sh build/$${i/.sol/.json} build/$${j/.sol/.js}; \
	done

install: migrate

migrate: build
	$(TRUFFLE) migrate $(DEST_NET)

deploy: build
	$(NODEJS) scripts/deploy.js $(DEST_NET) deploy-meta build/contracts -

check_submodule: contracts/openzeppelin-solidity/.git

contracts/openzeppelin-solidity/.git:
	git submodule init
	git submodule update

clean:
	@[ ! -d build ] || \rm -r build

aliases:
	@echo "alias truffle='"$(TRUFFLE)"';";	\
	echo "alias nodejs='"$(NODEJS)"';"

.PHONY: build clean aliases

# EOF
