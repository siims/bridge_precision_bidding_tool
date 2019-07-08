// prettier-ignore
export type BidKey = "pass" | "dbl" | "rdbl" | "interference" | "undiscussed" |
  "1C" | "1D" | "1H" | "1S" | "1N" |
  "2C" | "2D" | "2H" | "2S" | "2N" |
  "3C" | "3D" | "3H" | "3S" | "3N" |
  "4C" | "4D" | "4H" | "4S" | "4N" |
  "5C" | "5D" | "5H" | "5S" | "5N" |
  "6C" | "6D" | "6H" | "6S" | "6N" |
  "7C" | "7D" | "7H" | "7S" | "7N"

// prettier-ignore
export const allBiddingSequence: BidKey[] = [
  "1C", "1D", "1H", "1S", "1N",
  "2C", "2D", "2H", "2S", "2N",
  "3C", "3D", "3H", "3S", "3N",
  "4C", "4D", "4H", "4S", "4N",
  "5C", "5D", "5H", "5S", "5N",
  "6C", "6D", "6H", "6S", "6N",
  "7C", "7D", "7H", "7S", "7N"
];

export interface Bid {
  description: string;
  alertable?: boolean;
  responses?: { [bid: string]: Bid };
}

export const standardNoTrumpResponses = (noTrumpHeight: number): { [bid: string]: Bid } => {
  // TODO: use standardOneNoTrumpResponses to create answers on correct levels
  return standardOneNoTrumpResponses;
};

export const splinterResponses = (bidKey: BidKey): { [bid: string]: Bid } => {
  // TODO: make bids dependant on bidKey
  return {};
};

const standardOneNoTrumpResponses: { [bid: string]: Bid } = {
  "2C": {
    description: "Stayman",
    alertable: true,
    responses: {
      "2D": {
        description: "no 4 card major",
        alertable: true
      },
      "2H": {
        description: "4 card suit"
      },
      "2S": {
        description: "4 card suit"
      }
    }
  },
  "2D": {
    description: "5+H, transfer to H"
  },
  "2H": {
    description: "5+S, transfer to S"
  }
};

export const biddingSystem: { [bid: string]: Bid } = {
  "1C": {
    description: "F, 16+ HCP (or 17+ balanced)",
    responses: {
      "1D": {
        description: "0-7 HCP, any shape",
        responses: {
          "1H": {
            description: "4+H, F1",
            responses: {
              "1S": {
                description: "F, 4+S, denies 4+H",
                responses: {
                  "1N": {
                    description: "NF, 1444 likely"
                  },
                  "2C": {
                    description: "NF, 4+C, could be 5-4+ either way"
                  },
                  "2D": {
                    description: "NF, 4+D, could be 5-4+ either way"
                  },
                  "2H": {
                    description: "6+H"
                  },
                  "2S": {
                    description: "3-card raise 16-19 HCP, or 4-card raise 16-17 HCP"
                  },
                  "2N": {
                    description: "21-22 HCP, likely 0-1 spades"
                  },
                  "3C": {
                    description: "GF, 4H, 5 clubs"
                  },
                  "3D": {
                    description: "GF, 4H, 5 diamonds"
                  },
                  "3H": {
                    description: "INV, long good suit"
                  },
                  "3S": {
                    description: "3-card raise 20-21 HCP, or 4-card raise 18-19 HCP"
                  },
                  "3N": {
                    description: "to play, slam unlikely"
                  },
                  "4C": {
                    description: "4+S, 20+HCP, splinter"
                  },
                  "4D": {
                    description: "4+S, 20+ HCP, splinter"
                  },
                  "4H": {
                    description: "to play, slam unlikely"
                  }
                }
              },
              "1N": {
                description: "NF, 0-5 HCP without 4+ card support or 4+S, the “double negative”",
                responses: {
                  "2C": {
                    description: "NF, 4+C, could be 5-4+ either way"
                  },
                  "2D": {
                    description: "NF, 4+D, could be 5-4+ either way"
                  },
                  "2H": {
                    description: "6+H, usually"
                  },
                  "2S": {
                    description: "5+H - 4 spades, 21+ HCP, treat like reverse in standard"
                  },
                  "2N": {
                    description: "INV, 22-23 HCP"
                  },
                  "3C": {
                    description: "GF, 4H - 5+C"
                  },
                  "3D": {
                    description: "GF, 4H - 5+D"
                  },
                  "3H": {
                    description: "INV, long good suit"
                  },
                  "3N": {
                    description: "to play, slam unlikely"
                  },
                  "4H": {
                    description: "to play, slam unlikely"
                  }
                }
              },
              "2C": {
                description:
                  "F, “good hand, no fit” – 6-7 HCP without 3 or more hearts or 4 or more spades (over 1S, denies 5 or more hearts)",
                responses: {
                  "2D": {
                    description: "minimum, artificial, asks responder to show doubleton support or other major",
                    alertable: true
                  },
                  "2H": {
                    description: "NF, 6+H"
                  },
                  "2S": {
                    description: "F, reverse, 21+"
                  },
                  "2N": {
                    description: "GF, waiting bid",
                    alertable: true
                  },
                  "3C": {
                    description: "GF, 4+H - 6+C"
                  },
                  "3D": {
                    description: "GF, 4+H - 6+D"
                  },
                  "3H": {
                    description: "rebid 3 of major, suit setting"
                  }
                }
              },
              "2D": {
                description: "F, 3-card fit, (may have 5H over 1♠) – 5-7 HCP",
                alertable: true,
                responses: {
                  "2H": {
                    description: "Rebid major = sign-off, usually 4 cards"
                  },
                  "2S": {
                    description: "4+S"
                  },
                  "2N": {
                    description: "GF",
                    alertable: true
                  },
                  "3C": {
                    description: "GF, 4M-6+C"
                  },
                  "3D": {
                    description: "GF, 4M-6+D"
                  },
                  "3H": {
                    description: "INV, 5+H"
                  },
                  "3N": {
                    description: "to play"
                  }
                }
              },
              "2H": {
                description: "NF, 0-4 HCP, 4H-5H, Use your normal 1M-2M raise structure after"
              },
              "2S": {
                description: "NF, 4-6 HCP, 6+S, great suit, all HCP in this suit"
              },
              "2N": {
                description:
                  "mini-splinter, 4H, 5-7 HCP unbalanced, this is quite a good 1D bid in support of partner!",
                responses: {
                  "3C": {
                    description: "GF, asks responder to bid her singleton or void"
                  },
                  "3D": {
                    description: "???"
                  },
                  "3H": {
                    description: "to play, sign-off"
                  },
                  "4H": {
                    description: "to play, sign-off"
                  }
                }
              },
              "3C": {
                description: "NF, 4-6 HCP, 6+C, great suit, all HCP in this suit"
              },
              "3D": {
                description: "NF, 4-6 HCP, 6+D, great suit, all HCP in this suit"
              },
              "3H": {
                description: "INV, 5-7 HCP, 4H, balanced"
              },
              "3S": {
                description: "GF, 6-7 HCP, 5+H, splinter",
                alertable: true,
                responses: splinterResponses("3S")
              },
              "3N": {
                description: "???"
              },
              "4C": {
                description: "GF, 6-7 HCP, 5+S, splinter",
                responses: splinterResponses("4C")
              },
              "4D": {
                description: "GF, 6-7 HCP, 5+S, splinter",
                responses: splinterResponses("4D")
              }
            }
          },
          "1S": {
            description: "4+S, F1",
            responses: {
              "1N": {
                description: "NF, 0-5 HCP without 4+ card support or 4+S, the “double negative”",
                responses: {
                  "2C": {
                    description: "NF, 4+C, could be 5-4+ either way"
                  },
                  "2D": {
                    description: "NF, 4+D, could be 5-4+ either way"
                  },
                  "2H": {
                    description: "NF, 4+H 5+S"
                  },
                  "2S": {
                    description: "NF, 6+S, usually"
                  },
                  "2N": {
                    description: "INV, 22-23 HCP"
                  },
                  "3C": {
                    description: "GF, 4S - 5+C"
                  },
                  "3D": {
                    description: "GF, 4S - 5+D"
                  },
                  "3H": {
                    description: "???"
                  },
                  "3S": {
                    description: "INV, long good suit"
                  },
                  "3N": {
                    description: "to play, slam unlikely"
                  },
                  "4S": {
                    description: "to play, slam unlikely"
                  }
                }
              },
              "2C": {
                description:
                  "F, “good hand, no fit” – 6-7 HCP without 3 or more hearts or 4 or more spades (over 1S, denies 5 or more hearts)",
                responses: {
                  "2D": {
                    description: "F, minimum, artificial, asks responder to show doubleton support or other major",
                    alertable: true
                  },
                  "2H": {
                    description: "NF, 4+H 5+S, minimum"
                  },
                  "2S": {
                    description: "NF, 6+S"
                  },
                  "2N": {
                    description: "GF, waiting bid",
                    alertable: true
                  },
                  "3C": {
                    description: "GF, 4+S - 6+C"
                  },
                  "3D": {
                    description: "GF, 4+S - 6+D"
                  },
                  "3H": {
                    description: "???"
                  },
                  "3S": {
                    description: "rebid 3 of major, suit setting"
                  }
                }
              },
              "2D": {
                description: "F, 5-7 HCP, 3-card fit, (may have 5H over 1S)",
                alertable: true,
                responses: {
                  "2H": {
                    description: "NF, 4+H 5+S"
                  },
                  "2S": {
                    description: "Rebid major = sign-off, usually 4 cards"
                  },
                  "2N": {
                    description: "GF",
                    alertable: true
                  },
                  "3C": {
                    description: "GF, 4M-6+C"
                  },
                  "3D": {
                    description: "GF, 4M-6+D"
                  },
                  "3H": {
                    description: "???"
                  },
                  "3S": {
                    description: "INV, 5+S"
                  },
                  "3N": {
                    description: "to play"
                  }
                }
              },
              "2H": {
                description: "NF, 6-7 HCP, 5+H, denies 3 or more spades"
              },
              "2S": {
                description: "NF, 0-4 HCP, 4S-5S, Use your normal 1M-2M raise structure after"
              },
              "2N": {
                description:
                  "mini-splinter, 4S, 5-7 HCP unbalanced, this is quite a good 1D bid in support of partner!",
                responses: {
                  "3C": {
                    description: "GF, asks responder to bid her singleton or void"
                  },
                  "3D": {
                    description: "???"
                  },
                  "3H": {
                    description: "to play, sign-off"
                  },
                  "4H": {
                    description: "to play, sign-off"
                  }
                }
              },
              "3C": {
                description: "NF, 4-6 HCP, 6+C, great suit, all HCP in this suit"
              },
              "3D": {
                description: "NF, 4-6 HCP, 6+D, great suit, all HCP in this suit"
              },
              "3H": {
                description: "???"
              },
              "3S": {
                description: "INV, 5-7 HCP, 4S, balanced"
              },
              "3N": {
                description: "???"
              },
              "4C": {
                description: "GF, 6-7 HCP, 5+S, splinter",
                responses: splinterResponses("4C")
              },
              "4D": {
                description: "GF, 6-7 HCP, 5+S, splinter",
                responses: splinterResponses("4D")
              },
              "4H": {
                description: "GF, 6-7 HCP, 5+S, splinter",
                responses: splinterResponses("4H")
              }
            }
          },
          "1N": {
            description: "17-19 HCP, balanced",
            responses: standardNoTrumpResponses(1)
          },
          "2C": {
            description: "GF, 5+C, no 4 card major"
          },
          "2D": {
            description: "GF, 5+D, no 4 card major"
          },
          "2H": {
            description: "GF, 5+H"
          },
          "2S": {
            description: "GF, 5+S"
          },
          "2N": {
            description: "22-24 HCP, balanced",
            responses: standardNoTrumpResponses(2)
          },
          "3C": {
            description: "GF, C set as trumps, forces cue bids"
          },
          "3D": {
            description: "GF, D set as trumps, forces cue bids"
          },
          "3H": {
            description: "GF, H set as trumps, forces cue bids"
          },
          "3S": {
            description: "GF, S set as trumps, forces cue bids"
          },
          "3N": {
            description: "25-27 HCP, balanced"
          }
        }
      },
      "1H": {
        description: "8-11 HCP, any shape; by passed hand: 5+H, 8-10 HCP, game forcing",
        responses: {}
      },
      "1S": {
        description: "12+ HCP, 5+; by passed hand: 5+S, 8-10 HCP, game forcing",
        responses: {}
      },
      "1N": {
        description: "12+ HCP, balanced, no 5-card suit; by passed hand: balanced, 8-10 HCP, game forcing",
        responses: {}
      },
      "2C": {
        description: "12+ HCP, 5+; by passed hand: 5+C, 8-10 HCP, game forcing",
        responses: {}
      },
      "2D": {
        description: "12+ HCP, 5+; by passed hand: 5+D, 8-10 HCP, game forcing",
        responses: {}
      },
      "2H": {
        description: "12+ HCP, 5+",
        responses: {}
      },
      "2S": {
        description: "2+ HCP, any (4441) (2NT asks for singleton); by passed hand: 8-10 HCP (4441)",
        responses: {}
      },
      interference: {
        description:
          "At 1- or 2-level, Pass = 0-5, X = 6-7, others natural GF\n" +
          "At 3+ level, Pass = 0-6, X = 7+ GF, others natural GF\n" +
          "2-level cue = GF balanced no stopper, 3-level cue = 3-suiter GF\n" +
          "If responder is 0-7, pretend the opponents opened, doubles are takeout"
      }
    }
  },
  "1D": {
    description: "2+D, Good 10 to 15 HCP"
  },
  "1H": {
    description: "5+H, Good 10 to 15 HCP"
  },
  "1S": {
    description: "5+S, Good 10 to 15 HCP"
  },
  "1N": {
    description: "Balanced, 14-16 HCP"
  },
  "2C": {
    description: "6+C, Good 10 to 15 HCP"
  },
  "2D": {
    description: "4414/4405/3415/4315, Good 10 to 15 HCP"
  },
  "2H": {
    description: "weak, 6+H, 0 to bad 10 HCP"
  },
  "2S": {
    description: "weak, 6+S, 0 to bad 10 HCP"
  },
  "2N": {
    description: "20-21 HCP and may have a 5-card major"
  }
};
