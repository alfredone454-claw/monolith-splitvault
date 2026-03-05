/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/expense_splitter.json`.
 */
export type ExpenseSplitter = {
  "address": "3Jr6HyXcZecfZhNpP4r8ZaQerPuvpk5Qzkx4cgdX2VEE",
  "metadata": {
    "name": "expenseSplitter",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createExpense",
      "docs": [
        "Create a new expense in a group"
      ],
      "discriminator": [
        63,
        19,
        41,
        230,
        40,
        213,
        132,
        147
      ],
      "accounts": [
        {
          "name": "expense",
          "writable": true,
          "signer": true
        },
        {
          "name": "group"
        },
        {
          "name": "payer",
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
          "name": "description",
          "type": "string"
        },
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "splitType",
          "type": {
            "defined": {
              "name": "splitType"
            }
          }
        },
        {
          "name": "splitValues",
          "type": {
            "option": {
              "vec": "u64"
            }
          }
        }
      ]
    },
    {
      "name": "settleExpense",
      "docs": [
        "Mark expense as settled"
      ],
      "discriminator": [
        204,
        176,
        141,
        254,
        95,
        142,
        214,
        181
      ],
      "accounts": [
        {
          "name": "expense",
          "writable": true
        },
        {
          "name": "creator",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "expense",
      "discriminator": [
        49,
        167,
        206,
        160,
        209,
        254,
        24,
        100
      ]
    },
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
      "name": "groupInactive",
      "msg": "Group is not active"
    },
    {
      "code": 6002,
      "name": "notGroupMember",
      "msg": "Not a group member"
    },
    {
      "code": 6003,
      "name": "alreadySettled",
      "msg": "Expense already settled"
    },
    {
      "code": 6004,
      "name": "missingSplitValues",
      "msg": "Missing split values"
    },
    {
      "code": 6005,
      "name": "invalidPercentage",
      "msg": "Percentage total must be 100"
    },
    {
      "code": 6006,
      "name": "amountMismatch",
      "msg": "Amount mismatch"
    },
    {
      "code": 6007,
      "name": "noMembers",
      "msg": "No members in group"
    }
  ],
  "types": [
    {
      "name": "expense",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "group",
            "type": "pubkey"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "splitType",
            "type": {
              "defined": {
                "name": "splitType"
              }
            }
          },
          {
            "name": "splitValues",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "splits",
            "type": {
              "vec": {
                "defined": {
                  "name": "split"
                }
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "settled",
            "type": "bool"
          }
        ]
      }
    },
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
    },
    {
      "name": "split",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "member",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "paid",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "splitType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "equal"
          },
          {
            "name": "percentage"
          },
          {
            "name": "exact"
          }
        ]
      }
    }
  ]
};
