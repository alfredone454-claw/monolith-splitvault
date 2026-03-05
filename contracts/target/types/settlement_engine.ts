/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/settlement_engine.json`.
 */
export type SettlementEngine = {
  "address": "35SeWG8aR3qyhWdZRdHCHE8Mpg5fV2RTi8nyYP2XP2Q4",
  "metadata": {
    "name": "settlementEngine",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "payDebt",
      "docs": [
        "Pay a debt for a specific expense"
      ],
      "discriminator": [
        25,
        185,
        150,
        39,
        134,
        112,
        114,
        69
      ],
      "accounts": [
        {
          "name": "expense",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "expenseAlreadySettled",
      "msg": "Expense is already fully settled"
    },
    {
      "code": 6001,
      "name": "notParticipant",
      "msg": "Payer is not a participant in this expense"
    },
    {
      "code": 6002,
      "name": "alreadyPaid",
      "msg": "This debt has already been paid"
    },
    {
      "code": 6003,
      "name": "insufficientAmount",
      "msg": "Insufficient amount to pay debt"
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
            "type": "u8"
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
    }
  ]
};
