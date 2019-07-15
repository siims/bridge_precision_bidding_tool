// prettier-ignore
export type BidKey = "pass" | "dbl" | "rdbl" | "interference" | "undiscussed" | "comments" |
  "1C" | "1D" | "1H" | "1S" | "1N" |
  "2C" | "2D" | "2H" | "2S" | "2N" |
  "3C" | "3D" | "3H" | "3S" | "3N" |
  "4C" | "4D" | "4H" | "4S" | "4N" |
  "5C" | "5D" | "5H" | "5S" | "5N" |
  "6C" | "6D" | "6H" | "6S" | "6N" |
  "7C" | "7D" | "7H" | "7S" | "7N"

const alertable = true;
const notBook = true;

export const naturalBid: Bid = {
  description: "natural"
};

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
  notBook?: boolean;
  responses?: { [bid: string]: Bid };
}

export const standardNoTrumpResponses = (
  noTrumpHeight: number,
  minPoints: number = 14,
  maxPoints: number = 16
): { [bid: string]: Bid } => {
  // TODO: use standardOneNoTrumpResponses to create answers on correct levels
  return standardOneNoTrumpResponses;
};

export const splinterResponses = (bidKey: BidKey): { [bid: string]: Bid } => {
  // TODO: make bids dependant on bidKey
  return {};
};

export const staymanResponses = (bidKey: BidKey): { [bid: string]: Bid } => {
  // TODO: make bids dependant on bidKey to support 3rd level stayman
  return staymanResponsesOnFirstLevel;
};

const staymanResponsesOnFirstLevel: { [bid: string]: Bid } = {
  "2D": {
    description: "no 4 card major",
    alertable
  },
  "2H": {
    description: "4 card suit"
  },
  "2S": {
    description: "4 card suit"
  }
};

const standardOneNoTrumpResponses: { [bid: string]: Bid } = {
  "2C": {
    description: "Stayman",
    alertable,
    responses: staymanResponses("2C")
  },
  "2D": {
    description: "5+H, transfer to H"
  },
  "2H": {
    description: "5+S, transfer to S"
  },
  "2S": {
    description: "5+minor, transfer to minors"
  }
};

const reverseFlanneryResponses = (bid: BidKey) => {
  const responses = {
    "2S": {
      description: "to play"
    },
    "2N": {
      description: "INV, asking",
      alertable,
      responses: {
        "3C": {
          description: "weak, 5S-4H",
          alertable,
          responses: {
            "3D": {
              description: "asking for 4th suit stopper",
              alertable
            }
          }
        },
        "3D": {
          description: "GF, 5S-4H",
          alertable
        },
        "3H": {
          description: "weak, 5S-5+H",
          alertable
        },
        "3S": {
          description: "GF, 5S-5H",
          alertable
        }
      }
    },
    "3C": {
      description: "to play"
    },
    "3D": {
      description: "to play"
    },
    "3H": {
      description: "preemptive"
    },
    "3S": {
      description: "preemptive"
    },
    "3N": {
      description: "to play"
    }
  };
  if (bid === "2S") {
    delete responses["2S"];
  }
  return responses;
};

const stayman = (bidKey: BidKey): Bid => {
  return {
    description: "Stayman",
    responses: staymanResponses("2C")
  };
};

function checkback(bidKey: BidKey): Bid {
  return {
    description: "INV, Checkback Stayman",
    alertable,
    responses: {
      "2D": {
        description: "No 4-card major or 3-card support for responder's bid suit"
      },
      "2H": {
        description: "Showing a 4-card major, or 3-card support for responder's bid suit"
      },
      "2S": {
        description: "Showing a 4-card major, or 3-card support for responder's bid suit"
      }
    }
  };
}

const jacoby = (majorBid: BidKey): Bid => {
  let threeHearthBid: Bid;
  let threeSpadeBid: Bid;
  let fourHearthBid: Bid;
  let fourSpadeBid: Bid;

  if (majorBid[1] === "H") {
    threeHearthBid = {
      description: "11-13 HCP, minimum"
    };
    threeSpadeBid = {
      description: "S singleton or void",
      alertable
    };
    fourHearthBid = {
      description: "13-15 HCP, nothing more to show, probably balanced hand"
    };
    fourSpadeBid = naturalBid;
  } else {
    threeHearthBid = {
      description: "H singleton or void",
      alertable
    };
    threeSpadeBid = {
      description: "11-13 HCP, minimum"
    };
    fourHearthBid = {
      description: "5+H"
    };
    fourSpadeBid = {
      description: "13-15 HCP, nothing more to show, probably balanced hand"
    };
  }

  return {
    description: "Jacoby, 4+ support, INV+, 11+ HCP",
    alertable,
    responses: {
      "3C": {
        description: "C singleton or void",
        alertable
      },
      "3D": {
        description: "D singleton or void",
        alertable
      },
      "3H": threeHearthBid,
      "3S": threeSpadeBid,
      "3N": {
        description: "13-15, balanced, no singleton/void",
        alertable
      },
      "4C": {
        description: "5+C"
      },
      "4D": {
        description: "5+D"
      },
      "4H": fourHearthBid,
      "4S": fourSpadeBid
    }
  };
};

const forthSuitForcing: Bid = {
  description: "Fourth suit forcing",
  alertable,
  notBook
};

export const biddingSystem: { [bid: string]: Bid } = {
  "1C": {
    description: "F, 16+ HCP (or 17+ balanced)",
    alertable,
    responses: {
      "1D": {
        description: "0-7 HCP, any shape",
        alertable,
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
                    alertable
                  },
                  "2H": {
                    description: "NF, 6+H"
                  },
                  "2S": {
                    description: "F, reverse, 21+"
                  },
                  "2N": {
                    description: "GF, waiting bid",
                    alertable
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
                alertable,
                responses: {
                  "2H": {
                    description: "Rebid major = sign-off, usually 4 cards"
                  },
                  "2S": {
                    description: "4+S"
                  },
                  "2N": {
                    description: "GF",
                    alertable
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
                alertable,
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
              },
              "4H": {
                description: "to play"
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
                    alertable
                  },
                  "2H": {
                    description: "NF, 4+H 5+S, minimum"
                  },
                  "2S": {
                    description: "NF, 6+S"
                  },
                  "2N": {
                    description: "GF, waiting bid",
                    alertable
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
                alertable,
                responses: {
                  "2H": {
                    description: "NF, 4+H 5+S"
                  },
                  "2S": {
                    description: "Rebid major = sign-off, usually 4 cards"
                  },
                  "2N": {
                    description: "GF",
                    alertable
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
              },
              "4S": {
                description: "to play"
              }
            }
          },
          "1N": {
            description: "17-19 HCP, balanced",
            responses: standardNoTrumpResponses(1, 17, 19)
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
            responses: standardNoTrumpResponses(2, 22, 24)
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
        description: "GF, 8-11 HCP, any shape; by passed hand: 5+H, 8-10 HCP",
        alertable,
        responses: {}
      },
      "1S": {
        description: "GF, 12+ HCP, 5+; by passed hand: 5+S, 8-10 HCP",
        responses: {
          "2S": {
            description: "3+S",
            responses: {
              "3C": {
                description: "4+C",
                notBook
              },
              "3D": {
                description: "4+D",
                notBook
              },
              "3H": {
                description: "4+H",
                notBook
              }
            }
          }
        }
      },
      "1N": {
        description: "GF, 12+ HCP, balanced, no 5-card suit; by passed hand: balanced, 8-10 HCP",
        responses: {
          "2C": stayman("2C"),
          "2D": {
            description: "5+D, no 5 card major"
          },
          "2H": {
            description: "5+H"
          },
          "2S": {
            description: "5+S"
          },
          "2N": {
            description: "???"
          },
          "3C": {
            description: "5+C, no 5 card major"
          },
          "3D": {
            description: "???"
          },
          "3H": {
            description: "???"
          },
          "3S": {
            description: "???"
          },
          "3N": {
            description: "to play"
          }
        }
      },
      "2C": {
        description: "GF, 12+ HCP, 5+; by passed hand: 5+C, 8-10 HCP",
        responses: {}
      },
      "2D": {
        description: "GF, 12+ HCP, 5+; by passed hand: 5+D, 8-10 HCP",
        responses: {}
      },
      "2H": {
        description: "GF, 12+ HCP, 5+",
        responses: {}
      },
      "2S": {
        description: "GF, 12+ HCP, any (4441); by passed hand: 8-10 HCP (4441)",
        alertable,
        responses: {
          "2NT": {
            description: "asks for singleton",
            alertable,
            responses: {
              "3C": {
                description: "1C",
                alertable
              },
              "3D": {
                description: "1D",
                alertable
              },
              "3H": {
                description: "1H",
                alertable
              },
              "3S": {
                description: "1S",
                alertable
              }
            }
          }
        }
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
    description: "2+D, Good 10 to 15 HCP",
    alertable,
    responses: {
      "1H": {
        description: "F1, 4+H",
        alertable,
        responses: {
          "1S": {
            description: "NF, 4+S"
          },
          "1N": {
            description: "NF, 11-13 HCP",
            responses: {
              "2C": checkback("2C")
            }
          },
          "2C": {
            description: "NF, 5-4 minors",
            alertable,
            responses: {
              "2S": forthSuitForcing,
              "2N": {
                description: "minimum",
                notBook
              }
            }
          },
          "2D": {
            description: "NF, 6+D, no other biddable suit"
          },
          "2H": {
            description: "NF, 4+H, 11-13 HCP balanced, 10-12 HCP unbalanced"
          },
          "2N": {
            description: "NF, 6+D, 14-15 HCP"
          },
          "3C": {
            description: "NF, 5-5 minors, 13-15 HCP, decent suits"
          },
          "3D": {
            description: "NF, 7+D, 13-15 HCP"
          },
          "3H": {
            description: "NF, 4+H, 13-15 HCP"
          },
          comments: {
            description:
              "Checkback, Support Doubles, and 4th Suit Forcing can help determine if opener has 3-card support."
          }
        }
      },
      "1S": {
        description: "F1, 4+S",
        alertable,
        responses: {
          "1N": {
            description: "NF, 11-13 HCP",
            responses: {
              "2C": checkback("2C")
            }
          },
          "2C": {
            description: "NF, 5-4 minors, at least 3C when minimum 5D and no major support, 4C when 1444",
            alertable,
            responses: {
              "2H": forthSuitForcing,
              "2N": {
                description: "minimum",
                notBook
              }
            }
          },
          "2D": {
            description: "NF, 6+D, no other biddable suit"
          },
          "2H": {
            description: "NF, 4H, max, reverse"
          },
          "2S": {
            description: "NF, 4+S, 11-13 HCP balanced, 10-12 HCP unbalanced"
          },
          "2N": {
            description: "NF, 6+D, 14-15 HCP",
            alertable
          },
          "3C": {
            description: "NF, 5-5 minors, 13-15 HCP, decent suits",
            alertable
          },
          "3D": {
            description: "NF, 7+D, 13-15 HCP"
          },
          "3S": {
            description: "NF, 4+S, 13-15 HCP"
          }
        }
      },
      "1N": {
        description: "7-11 HCP, balanced, no 4M, occasionally 6C"
      },
      "2C": {
        description: "GF unless suit rebid, 4+C, no 4+M unless 6-4+ suits",
        alertable,
        responses: {
          "2D": {
            description: "5+D, denies 4+C, unbalanced",
            responses: {
              "3C": {
                description: "INV, to play"
              },
              comments: {
                description:
                  "everything else is GF, responder can rebid 2 of a major as a semi-natural bid, confirming a game force"
              }
            }
          },
          "2H": {
            description: "11-13 HCP balanced, says nothing about hearts - could have support for responder's minor",
            alertable,
            responses: {
              "2S": {
                description: "puppet to 2NT, often just a way to right-side notrump",
                alertable,
                responses: {
                  "2N": {
                    description: "forced",
                    alertable,
                    responses: {
                      "3C": {
                        description: "GF, slam interest"
                      },
                      "3D": {
                        description: "???"
                      },
                      "3H": {
                        description: "GF, 6+C, 4H (with just 5 of the minor, respond 1M to start)"
                      },
                      "3S": {
                        description: "GF, 6+C, 4S (with just 5 of the minor, respond 1M to start)"
                      },
                      "3N": {
                        description: "to play, used the 2S force to get opener to declare"
                      }
                    }
                  }
                }
              },
              "2N": {
                description: "slam interest, balanced, asks for a 4+card minor",
                alertable
              },
              "3C": {
                description: "INV"
              },
              "3D": {
                description: "???"
              },
              "3H": {
                description: "GF, 6+C 5H"
              },
              "3S": {
                description: "GF, 6+C 5S"
              },
              "3N": {
                description: "prefers to declare 3NT (else use the 2S force to get opener to declare)"
              }
            }
          },
          "2S": {
            description: "GF, 4+C, an undisclosed splinter for partner’s minor (never short diamonds, of course)",
            alertable,
            responses: {
              "2N": {
                description: "asks which splinter in steps (steps 1/2/3 show hi/mid/lo)",
                alertable,
                responses: {
                  "3C": {
                    description: "splinter in highest suit"
                  },
                  "3D": {
                    description: "splinter in middle suit"
                  },
                  "3H": {
                    description: "splinter in low suit"
                  }
                }
              }
            }
          },
          "2N": {
            description: "minimum, shows 4441 exactly"
          },
          "3C": {
            description:
              "GF, 3 cards in responder’s minor, 5 cards in the other minor, and a 4-card major (3D can now ask which major opener has)",
            alertable
          },
          "3D": {
            description: "GF, a very good 6+D suit"
          },
          "3H": {
            description: "GF, 6+D 5H"
          },
          "3S": {
            description: "GF, 6+D 5S"
          },
          "3N": {
            description: "maximum, shows 4441 exactly"
          }
        }
      },
      "2D": {
        description: "GF unless suit rebid, 4+D, no 4+M unless 6-4+ suits",
        alertable,
        responses: {
          "2H": {
            description: "11-13 HCP balanced, says nothing about hearts - could have support for responder's minor",
            alertable,
            responses: {
              "2S": {
                description: "puppet to 2NT, often just a way to right-side notrump",
                alertable,
                responses: {
                  "2N": {
                    description: "forced",
                    alertable,
                    responses: {
                      "3C": {
                        description: "???"
                      },
                      "3D": {
                        description: "GF, slam interest"
                      },
                      "3H": {
                        description: "GF, 6+C, 4H (with just 5 of the minor, respond 1M to start)"
                      },
                      "3S": {
                        description: "GF, 6+C, 4S (with just 5 of the minor, respond 1M to start)"
                      },
                      "3N": {
                        description: "to play, used the 2S force to get opener to declare"
                      }
                    }
                  }
                }
              },
              "2N": {
                description: "slam interest, balanced, asks for a 4+card minor"
              },
              "3C": {
                description: "INV"
              },
              "3D": {
                description: "INV"
              },
              "3H": {
                description: "GF, 6+D 5H"
              },
              "3S": {
                description: "GF, 6+D 5S"
              },
              "3N": {
                description: "prefers to declare 3NT (else use the 2S force to get opener to declare)"
              }
            }
          },
          "2S": {
            description: "GF, 4+D, an undisclosed splinter for partner’s minor (never short diamonds, of course)",
            alertable,
            responses: {
              "2N": {
                description: "asks which splinter in steps (steps 1/2/3 show hi/mid/lo)",
                alertable,
                responses: {
                  "3C": {
                    description: "splinter in highest suit"
                  },
                  "3D": {
                    description: "splinter in middle suit"
                  },
                  "3H": {
                    description: "splinter in low suit"
                  }
                }
              }
            }
          },
          "2N": {
            description: "minimum, balanced, 6D exactly"
          },
          "3C": {
            description:
              "GF, 3 cards in responder’s minor, 5 cards in the other minor, and a 4-card major (3D can now ask which major opener has)",
            alertable,
            responses: {
              "3D": {
                description: "ask what major opener has",
                alertable,
                responses: {
                  "3H": {
                    description: "4H"
                  },
                  "3S": {
                    description: "4S"
                  }
                }
              }
            }
          },
          "3D": {
            description: "GF, a very good 6+D suit"
          },
          "3H": {
            description: "GF, 6+D 5H"
          },
          "3S": {
            description: "GF, 6+D 5S"
          },
          "3N": {
            description: "maximum, 6D exactly"
          }
        }
      },
      "2H": {
        description: "below INV, 5S-4/5H, less than invitational. Reverse Flannery",
        alertable,
        responses: reverseFlanneryResponses("2H")
      },
      "2S": {
        description: "INV, 5S-4/5H, 6-9 HCP",
        alertable,
        responses: reverseFlanneryResponses("2S")
      },
      "2N": {
        description: "INV, 11-12 HCP, no 4M"
      },
      "3C": {
        description: "below INV, 5-4 minors at least, either could be longer, 6-10 HCP",
        alertable
      },
      "3D": {
        description: "below INV, 6+D, 5-10 HCP",
        alertable
      },
      "3H": {
        description: "7+H, weak 5-10 HCP"
      },
      "3S": {
        description: "7+S, weak 5-10 HCP"
      },
      "3N": {
        description: "13-16 HCP, balanced, no 4M"
      },
      "4C": {
        description: "below INV, 5+C-5+D",
        alertable
      },
      "4D": {
        description: "7+D, to play, wide-range",
        alertable
      },
      "4H": {
        description: "7+H, to play, wide-range",
        alertable
      },
      "4S": {
        description: "7+S, to play, wide-range",
        alertable
      },
      interference: {
        description:
          "Treat mostly like a standard 1D opening after interference\n\tJumps to 3C, 3D retain their meaning as above\n\tResponder bidding diamonds is not a raise but a new suit"
      }
    }
  },
  "1H": {
    description: "5+H, Good 10 to 15 HCP",
    responses: {
      "2N": jacoby("1H"),
      "4H": {
        description: "wide range, 3+H",
        alertable
      }
    }
  },
  "1S": {
    description: "5+S, Good 10 to 15 HCP",
    responses: {
      "2N": jacoby("1S"),
      "4S": {
        description: "wide range, 3+S",
        alertable
      }
    }
  },
  "1N": {
    description: "Balanced, 14-16 HCP, can have 5 card major and 5m-(422)",
    alertable,
    responses: standardOneNoTrumpResponses
  },
  "2C": {
    description: "6+C, Good 10 to 15 HCP",
    alertable,
    responses: {
      "2D": {
        description: "invite or better inquiry",
        alertable,
        responses: {
          "2H": {
            description: "any 4M",
            alertable,
            responses: {
              "2S": {
                description: "asks for the 4M suit and strength",
                alertable,
                responses: {
                  "2N": {
                    description: "4H, 10-13 HCP",
                    alertable,
                    responses: {
                      "3D": {
                        description: "slam try in C",
                        alertable
                      },
                      "3H": {
                        description: "slam try in S",
                        alertable
                      },
                      "3S": {
                        description: "invite to S game",
                        alertable
                      },
                      "3N": {
                        description: "to play"
                      },
                      "4S": {
                        description: "to play"
                      },
                      "5C": {
                        description: "to play"
                      }
                    }
                  },
                  "3C": {
                    description: "4S, 10-13 HCP",
                    alertable,
                    responses: {
                      "3D": {
                        description: "slam try in C",
                        alertable
                      },
                      "3H": {
                        description: "invite to H game",
                        alertable
                      },
                      "3S": {
                        description: "slam try in H",
                        alertable
                      },
                      "3N": {
                        description: "to play"
                      },
                      "4H": {
                        description: "to play"
                      },
                      "5C": {
                        description: "to play"
                      }
                    }
                  },
                  "3D": {
                    description: "GF, 4H, 14-15 HCP",
                    alertable,
                    responses: {
                      "3H": {
                        description: "slam try",
                        alertable
                      },
                      "3N": {
                        description: "to play"
                      },
                      "4H": {
                        description: "to play"
                      },
                      "5C": {
                        description: "to play"
                      }
                    }
                  },
                  "3H": {
                    description: "GF, 4S, 10-13 HCP",
                    alertable,
                    responses: {
                      "3S": {
                        description: "slam try",
                        alertable
                      },
                      "3N": {
                        description: "to play"
                      },
                      "4S": {
                        description: "to play"
                      },
                      "5C": {
                        description: "to play"
                      }
                    }
                  }
                }
              },
              "2N": {
                description: "INV, natural, no interest in the major"
              },
              "3C": {
                description: "INV, natural, no interest in the major"
              },
              "3D": {
                description: "slam try in clubs"
              }
            }
          },
          "2S": {
            description: "a medium or maximum hand, no 4-card major",
            alertable,
            responses: {
              "2N": {
                description: "asks opener if medium or maximum",
                alertable,
                responses: {
                  "3C": {
                    description: "medium",
                    alertable
                  },
                  "3D": {
                    description: "max, singleton/void in D",
                    alertable
                  },
                  "3H": {
                    description: "max, singleton/void in H",
                    alertable
                  },
                  "3S": {
                    description: "max, singleton/void in S",
                    alertable
                  },
                  "3N": {
                    description: "max, no singleton/void",
                    alertable
                  }
                }
              },
              "3C": {
                description:
                  "“the brakes” – responder is no longer interested in game, responder was hoping to catch a major fit, opener must pass",
                alertable
              },
              "3D": {
                description: "slam try in C",
                alertable
              },
              "3H": {
                description: "GF, 5H",
                alertable
              },
              "3S": {
                description: "GF, 5S",
                alertable
              }
            }
          },
          "2N": {
            description: "a maximum hand, with stoppers in both majors, no 4-card major",
            alertable,
            responses: {
              "3D": {
                description: "slam try in C",
                alertable
              },
              "3H": {
                description: "GF, 5H",
                alertable
              },
              "3S": {
                description: "GF, 5S",
                alertable
              }
            }
          },
          "3C": {
            description: "“the pits” – a very minimum hand with not a great suit, no 4-card major",
            alertable,
            responses: {
              "3D": {
                description: "slam try in C",
                alertable
              },
              "3H": {
                description: "GF, 5H",
                alertable
              },
              "3S": {
                description: "GF, 5S",
                alertable
              }
            }
          },
          "3D": {
            description: "GF, 5D",
            alertable
          },
          "3H": {
            description: "GF, 5H",
            alertable
          },
          "3S": {
            description: "GF, 5S",
            alertable
          }
        }
      },
      "2H": {
        description: "NF, 5+H, 8-11 HCP",
        alertable,
        responses: {
          "2S": {
            description: "to play, no tolerance in H"
          },
          "2N": {
            description: "to play, no tolerance in H"
          },
          "3C": {
            description: "to play, 7+C"
          },
          "3H": {
            description: "INV, 3+H"
          },
          "4H": {
            description: "to play"
          }
        }
      },
      "2S": {
        description: "NF, 5+S, 8-11 HCP",
        alertable,
        responses: {
          "2N": {
            description: "to play, no tolerance in H"
          },
          "3C": {
            description: "to play, 7+C"
          },
          "3S": {
            description: "INV, 3+S"
          },
          "4S": {
            description: "to play"
          }
        }
      },
      "2N": {
        description: "puppet to 3C, either to play or some 5-5 suits GF",
        alertable,
        responses: {
          "3C": {
            description: "forced",
            alertable,
            responses: {
              "3D": {
                description: "GF, 5H/5S",
                alertable,
                responses: {
                  "3H": {
                    description: "H set as trumps",
                    alertable
                  },
                  "3S": {
                    description: "S set as trumps",
                    alertable
                  },
                  "3N": {
                    description: "to play, no fit",
                    alertable
                  },
                  "4C": {
                    description: "no fit",
                    alertable
                  },
                  "4D": {
                    description: "fit in D",
                    alertable
                  }
                }
              },
              "3H": {
                description: "GF, 5D/5H",
                alertable,
                responses: {
                  "3S": {
                    description: "H set as trumps",
                    alertable
                  }
                }
              },
              "3S": {
                description: "GF, 5D/5S",
                alertable
              }
            }
          }
        }
      },
      "3C": {
        description: "INV+, 6+D, cards in the next higher suit",
        alertable
      },
      "3D": {
        description: "INV+, 6+H, cards in the next higher suit",
        alertable
      },
      "3H": {
        description: "INV+, 6+S, cards in the next higher suit",
        alertable
      },
      "3S": {
        description: "GF, 6S-4H",
        alertable
      },
      "3N": {
        description: "to play"
      },
      "4C": {
        description: "to play, preemptive"
      },
      "5C": {
        description: "to play, preemptive"
      },
      interference: {
        description: "Negative/takeout doubles by opener and responder\n\t2NT = invite\n\t3C = to play"
      }
    }
  },
  "2D": {
    description: "4414/4405/3415/4315, Good 10 to 15 HCP",
    alertable,
    responses: {
      "2H": {
        description: "to play, (opener corrects to 2S with 4315 exactly)"
      },
      "2S": {
        description: "to play"
      },
      "2N": {
        description: "F, strong inquiry",
        alertable
      },
      "3C": {
        description: "to play, 4+C"
      },
      "3D": {
        description: "iNV, long diamonds"
      },
      "3H": {
        description: "mixed raise, 5+H"
      },
      "3S": {
        description: "mixed raise, 5+S"
      },
      "3N": {
        description: "to play"
      },
      "4C": {
        description: "mixed raise, 5+C"
      },
      "5C": {
        description: "to play"
      },
      interference: {
        description: "X = penalty\n\t2N = normal asking bid"
      }
    }
  },
  "2H": {
    description: "weak, 6+H, 0 to bad 10 HCP"
  },
  "2S": {
    description: "weak, 6+S, 0 to bad 10 HCP"
  },
  "2N": {
    description: "20-21 HCP and may have a 5-card major"
  },
  "3C": {
    description: "7+C, weak"
  },
  "3D": {
    description: "7+D, weak"
  },
  "3H": {
    description: "7+H, weak"
  },
  "3S": {
    description: "7+S, weak"
  },
  "3N": {
    description: "Gambling - 7+ suit AKQ",
    alertable
  }
};
