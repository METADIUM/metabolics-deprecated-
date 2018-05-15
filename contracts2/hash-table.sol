pragma solidity ^0.4.0;

contract HashTable {
    struct Datum {
        bool valid;
        bytes value;
    }

    int256 public count;
    mapping (bytes => Datum) data;

    event Xxx(string which, string key, string value);

    /* returns old data if exists */
    function put(bytes key, bytes value) public {
        Datum storage d = data[key];
        if (!d.valid)
            count++;
        d.valid = true;
        d.value = value;
    }

    // _data is tightly packed.
    // if not use: ix += 0x20 + (k.length+31)/32*32, instead of
    //             ix += 0x20 + k.length
    function mput(bytes _data) public returns (uint cnt) {
        bytes memory k;
        bytes memory v;
        uint ix;
        uint eix;

        assembly {
            ix := add(_data, 0x20)
        }
        eix = ix + _data.length;

        while (ix < eix) {
            assembly {
                k := ix
            }
            ix += 0x20 + k.length;
            require(ix < eix);
            assembly {
                v := ix
            }
            ix += 0x20 + v.length;
            require(ix <= eix);

            put(k, v);
            cnt++;
        }
    }

    function del(bytes key) public {
        if (data[key].valid)
            count--;
        delete data[key];
    }

    function get(bytes key) public view returns (bytes value) {
        Datum storage d = data[key];
        //bool exists = d.valid;
        value = d.value;
    }
}

/* EOF */
