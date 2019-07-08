import React, { useState } from "react";
import "./App.css";
import _ from "lodash";

// prettier-ignore
type BidKey = "pass" | "dbl" | "rdbl" | "interference" | "undiscussed" |
  "1C" | "1D" | "1H" | "1S" | "1N" |
  "2C" | "2D" | "2H" | "2S" | "2N" |
  "3C" | "3D" | "3H" | "3S" | "3N" |
  "4C" | "4D" | "4H" | "4S" | "4N" |
  "5C" | "5D" | "5H" | "5S" | "5N" |
  "6C" | "6D" | "6H" | "6S" | "6N" |
  "7C" | "7D" | "7H" | "7S" | "7N"

// prettier-ignore
const allBiddingSequence: BidKey[] = [
  "1C", "1D", "1H", "1S", "1N",
  "2C", "2D", "2H", "2S", "2N",
  "3C", "3D", "3H", "3S", "3N",
  "4C", "4D", "4H", "4S", "4N",
  "5C", "5D", "5H", "5S", "5N",
  "6C", "6D", "6H", "6S", "6N",
  "7C", "7D", "7H", "7S", "7N"
];

interface Bid {
  description: string;
  alertable?: boolean;
  responses?: { [bid: string]: Bid };
}

const biddingSystem: { [bid: string]: Bid } = {
  "1C": {
    description: "16+ HCP (or 17+ balanced)",
    responses: {
      "1D": {
        description: "0-7 HCP, any shape",
        responses: {}
      },
      "1H": {
        description: "8-11 HCP, any shape; by passed hand: 5+ cards, 8-10 HCP, game forcing",
        responses: {}
      },
      "1S": {
        description: "12+ HCP, 5+; by passed hand: 5+ cards, 8-10 HCP, game forcing",
        responses: {}
      },
      "1N": {
        description: "12+ HCP, balanced, no 5-card suit; by passed hand: balanced, 8-10 HCP, game forcing",
        responses: {}
      },
      "2C": {
        description: "12+ HCP, 5+; by passed hand: 5+ cards, 8-10 HCP, game forcing",
        responses: {}
      },
      "2D": {
        description: "12+ HCP, 5+; by passed hand: 5+ cards, 8-10 HCP, game forcing",
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
    description: "2+ Diamonds, Good 10 to 15 HCP"
  },
  "1H": {
    description: "5M+ Cards, Good 10 to 15 HCP"
  },
  "1S": {
    description: "5M+ Cards, Good 10 to 15 HCP"
  },
  "1N": {
    description: "Balanced, 14-16 HCP"
  },
  "2C": {
    description: "6+ Clubs, Good 10 to 15 HCP"
  },
  "2D": {
    description: "4414/4405/3415/4315, Good 10 to 15 HCP"
  },
  "2H": {
    description: "weak, 6+ suit, 0 to bad 10 HCP"
  },
  "2S": {
    description: "weak, 6+ suit, 0 to bad 10 HCP"
  },
  "2N": {
    description: "20-21 HCP and may have a 5-card major"
  }
};

const naturalBid: Bid = {
  description: "natural"
};

type Seat = "N" | "E" | "S" | "W";

interface BidRecord {
  seat: Seat;
  bidKey: BidKey;
  bid: Bid;
}

interface PotentialBid {
  description: string;
  bidKey: BidKey;
}

const App: React.FC = () => {
  const [currentBidder, setBidder] = useState<Seat>("N");
  const [biddingSoFar, setBidding] = useState<BidRecord[]>([]);
  const [potentialBidDetails, setPotentialBidDetails] = useState<PotentialBid | undefined>();

  function handleMakeBid(event: React.SyntheticEvent<HTMLButtonElement>) {
    const bidKey: BidKey = event.currentTarget.dataset.bidkey as BidKey;
    const lastElement = _.last(biddingSoFar);
    if (lastElement) {
      const lastBid: Bid = lastElement.bid;
      const currentBid: Bid = (lastBid.responses && lastBid.responses[bidKey]) || naturalBid;
      setBidding([...biddingSoFar, { seat: currentBidder, bidKey, bid: currentBid }]);
    } else {
      const currentBid: Bid = biddingSystem[bidKey] ? biddingSystem[bidKey] : naturalBid;
      setBidding([{ seat: currentBidder, bidKey, bid: currentBid }]);
    }
    setBidder(currentBidder === "N" ? "S" : "N");
  }

  function resetBidding(event: React.SyntheticEvent<HTMLButtonElement>) {
    setBidding([]);
  }

  function getLastBidIndexInAllBids(last: BidRecord | undefined): number {
    return last ? allBiddingSequence.indexOf(last.bidKey) : 0;
  }

  function getPossibleBids(bidding: BidRecord[]) {
    if (_.isEmpty(biddingSoFar)) {
      return allBiddingSequence;
    }
    return allBiddingSequence.slice(getLastBidIndexInAllBids(_.last(bidding)) + 1);
  }

  function undoLastBid() {
    if (_.isEmpty(biddingSoFar)) {
      return;
    }
    setBidding(biddingSoFar.slice(0, biddingSoFar.length - 1));
    setBidder(currentBidder === "N" ? "S" : "N");
  }

  function displayBidDetails(event: React.SyntheticEvent<HTMLButtonElement>) {
    const bidKey: BidKey = event.currentTarget.dataset.bidkey as BidKey;
    if (_.isEmpty(biddingSoFar)) {
      if (biddingSystem[bidKey]) {
        setPotentialBidDetails({ bidKey, description: biddingSystem[bidKey].description });
      } else {
        setPotentialBidDetails({ bidKey, description: naturalBid.description });
      }
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      const lastBid = _.last(biddingSoFar)!.bid;
      if (lastBid.responses && lastBid.responses[bidKey]) {
        setPotentialBidDetails({ bidKey, description: lastBid.responses[bidKey].description });
      } else {
        setPotentialBidDetails({ bidKey, description: naturalBid.description });
      }
    }
  }

  function getResponsesToLastBid(): PotentialBid[] {
    const potentialBids: PotentialBid[] = [];

    const lastBid = _.last(biddingSoFar);
    if (_.isEmpty(biddingSoFar)) {
      for (const [key, value] of Object.entries(biddingSystem)) {
        potentialBids.push({
          bidKey: key as BidKey,
          description: value.description
        });
      }
    } else if (lastBid && lastBid.bid.responses) {
      for (const [key, value] of Object.entries(lastBid.bid.responses)) {
        potentialBids.push({
          bidKey: key as BidKey,
          description: value.description
        });
      }
    }
    return potentialBids;
  }

  return (
    <div className="App">
      <button onClick={resetBidding}>Reset Bidding</button>
      <button onClick={undoLastBid}>Undo</button>
      <br />
      {/* BIDDING SO FAR VISUALIZED */}
      <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
        <div>N</div>
        <div>S</div>
        {biddingSoFar.map(bidRecord => (
          <div key={bidRecord.bidKey}>
            <strong>{bidRecord.bidKey}</strong> - {bidRecord.bid.description}
          </div>
        ))}
        <div>*</div>
        {_.isEmpty(biddingSoFar) && <div />}
      </div>
      {/* BIDDING BUTTON HOVER */}
      {potentialBidDetails && (
        <div>
          <strong>{potentialBidDetails.bidKey}</strong> {potentialBidDetails.description}
        </div>
      )}
      {/* BIDDING BUTTONS*/}
      <div style={{ display: "grid", gridTemplateColumns: "3rem 3rem 3rem 3rem 3rem" }}>
        {getPossibleBids(biddingSoFar).map(bidKey => {
          const rowNumber = Number(bidKey[0]);
          const columnNumber =
            bidKey[1] === "C" ? 1 : bidKey[1] === "D" ? 2 : bidKey[1] === "H" ? 3 : bidKey[1] === "S" ? 4 : 5;
          return (
            <button
              key={bidKey}
              data-bidkey={bidKey}
              onClick={handleMakeBid}
              onMouseEnter={displayBidDetails}
              onPointerEnter={displayBidDetails}
              style={{ gridArea: `${rowNumber} / ${columnNumber} / ${rowNumber + 1} / ${columnNumber + 1}` }}
            >
              {bidKey}
            </button>
          );
        })}
      </div>
      {/* RESPONSE SUMMARY */}
      <div >
      {getResponsesToLastBid().map(potentialBid => (
        <div key={potentialBid.bidKey}>
          <strong>{potentialBid.bidKey}</strong> - {potentialBid.description}
        </div>
      ))}
      </div>
    </div>
  );
};

export default App;
