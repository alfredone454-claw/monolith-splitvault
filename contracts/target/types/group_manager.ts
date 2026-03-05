/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/group_manager.json`.
 */
export type GroupManager = {
  "address": "33LuG9n23n8GgmGWyLUy7y1PHmEjAK1XGW66gV5cDmjL",
  "metadata": {
    "name": "groupManager",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addMember",
      "docs": [
        "Add member to existing group"
      ],
      "discriminator": [
        13,
        116,
        123,
        130,
        126,
        198,
        57,
        34
      ],
      "accounts": [
        {
          "name": "group",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "member",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "closeGroup",
      "docs": [
        "Close/deactivate group"
      ],
      "discriminator": [
        40,
        187,
        201,
        187,
        18,
        194,
        122,
        232
      ],
      "accounts": [
        {
          "name": "group",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createGroup",
      "docs": [
        "Create a new group for bill splitting"
      ],
      "discriminator": [
        79,
        60,
        158,
        134,
        61,
        199,
        56,
        248
      ],
      "accounts": [
        {
          "name": "group",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "memberPubkeys",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "removeMember",
      "docs": [
        "Remove member from group"
      ],
      "discriminator": [
        171,
        57,
        231,
        150,
        167,
        128,
        18,
        55
      ],
      "accounts": [
        {
          "name": "group",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "member",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "group",
      "discriminator": [
        209,
        249,
        208,
        63,
        182,
        89,
        186,
        254
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6001,
      "name": "memberAlreadyExists",
      "msg": "Member already exists"
    },
    {
      "code": 6002,
      "name": "memberNotFound",
      "msg": "Member not found"
    },
    {
      "code": 6003,
      "name": "groupInactive",
      "msg": "Group is not active"
    }
  ],
  "types": [
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "members",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
