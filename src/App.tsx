import React, {useState} from "react";
import "./App.css";
import _ from "lodash";
import {allBiddingSequence, Bid, biddingSystem, BidKey, naturalBid} from "./biddingSystemConfiguration";


type Seat = "N" | "E" | "S" | "W";

interface BidRecord {
  seat: Seat;
  bidKey: BidKey;
  bid: Bid;
}

interface PotentialBid {
  description: string;
  bidKey: BidKey;
  alertable?: boolean;
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

  function resetBidding() {
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
        setPotentialBidDetails({
          bidKey,
          description: biddingSystem[bidKey].description,
          alertable: biddingSystem[bidKey].alertable
        });
      } else {
        setPotentialBidDetails({ bidKey, description: naturalBid.description });
      }
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      const lastBid = _.last(biddingSoFar)!.bid;
      if (lastBid.responses && lastBid.responses[bidKey]) {
        setPotentialBidDetails({
          bidKey,
          description: lastBid.responses[bidKey].description,
          alertable: lastBid.responses[bidKey].alertable
        });
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
        <div style={{color: `${potentialBidDetails.alertable ? "#00f" : "#000"}`}}>
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
      <div>
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
